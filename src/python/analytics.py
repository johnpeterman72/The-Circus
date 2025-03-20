#!/usr/bin/env python3
"""
Circus Analytics Tool
A sample analytics script for processing circus performance data.
"""

import json
import csv
import yaml
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import os

class CircusAnalytics:
    """Analytics class for circus data processing and visualization."""
    
    def __init__(self, data_dir='../../data'):
        """Initialize with path to data directory."""
        self.data_dir = data_dir
        self.performers = None
        self.shows = None
        self.venues = None
        self.load_data()
    
    def load_data(self):
        """Load all data sources."""
        # Load performers from JSON
        with open(os.path.join(self.data_dir, 'performers.json'), 'r') as f:
            self.performers = json.load(f)['performers']
        
        # Load shows from CSV
        shows_path = os.path.join(self.data_dir, 'shows.csv')
        self.shows = pd.read_csv(shows_path)
        
        # Load venues from YAML
        with open(os.path.join(self.data_dir, 'venues.yaml'), 'r') as f:
            self.venues = yaml.safe_load(f)['venues']
    
    def get_active_performers(self):
        """Return only active performers."""
        return [p for p in self.performers if p.get('active', False)]
    
    def get_upcoming_shows(self):
        """Return upcoming shows based on start date."""
        today = datetime.now().strftime('%Y-%m-%d')
        return self.shows[self.shows['start_date'] >= today]
    
    def calculate_revenue_potential(self):
        """Calculate potential revenue for each show."""
        self.shows['avg_ticket'] = (self.shows['ticket_price_min'] + self.shows['ticket_price_max']) / 2
        self.shows['potential_revenue'] = self.shows['avg_ticket'] * self.shows['capacity']
        return self.shows[['show_id', 'title', 'potential_revenue']].sort_values('potential_revenue', ascending=False)
    
    def get_performer_specialties(self):
        """Count performers by specialty."""
        specialties = {}
        for performer in self.performers:
            specialty = performer.get('specialty')
            if specialty:
                specialties[specialty] = specialties.get(specialty, 0) + 1
        return specialties
    
    def plot_shows_by_venue(self):
        """Create a bar chart of shows per venue."""
        venue_counts = self.shows['venue_id'].value_counts().sort_index()
        
        plt.figure(figsize=(10, 6))
        bars = plt.bar(venue_counts.index, venue_counts.values)
        
        # Add venue names as labels
        venue_names = {v['id']: v['name'] for v in self.venues}
        labels = [venue_names.get(vid, f"Venue {vid}") for vid in venue_counts.index]
        
        plt.xticks(venue_counts.index, labels, rotation=45, ha='right')
        plt.xlabel('Venue')
        plt.ylabel('Number of Shows')
        plt.title('Number of Shows by Venue')
        plt.tight_layout()
        
        # Save the plot
        output_dir = os.path.dirname(os.path.abspath(__file__))
        plt.savefig(os.path.join(output_dir, 'shows_by_venue.png'))
        plt.close()
    
    def generate_report(self):
        """Generate a summary report of circus statistics."""
        report = {
            "total_performers": len(self.performers),
            "active_performers": len(self.get_active_performers()),
            "upcoming_shows": len(self.get_upcoming_shows()),
            "total_venues": len(self.venues),
            "total_capacity": sum(v.get('capacity', 0) for v in self.venues),
            "specialties": self.get_performer_specialties(),
            "revenue_potential": self.calculate_revenue_potential().to_dict('records')
        }
        
        # Write report to file
        output_dir = os.path.dirname(os.path.abspath(__file__))
        with open(os.path.join(output_dir, 'analytics_report.json'), 'w') as f:
            json.dump(report, f, indent=2)
            
        return report

if __name__ == "__main__":
    # Create analytics instance and run report
    analytics = CircusAnalytics()
    report = analytics.generate_report()
    
    # Create visualizations
    analytics.plot_shows_by_venue()
    
    print(f"Analysis complete! Found {report['total_performers']} performers and {report['upcoming_shows']} upcoming shows.")
    print(f"Report saved to 'analytics_report.json'")
