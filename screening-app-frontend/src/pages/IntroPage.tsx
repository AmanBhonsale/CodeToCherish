import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui setup and alias @ is configured
import { ArrowRight, CheckCircle } from 'lucide-react';

const IntroPage: React.FC = () => {
  // This page is currently routed to be outside the RootLayout (no main navbar)
  // So, we create a self-contained landing page experience.
  return (
    <div className="flex flex-col min-h-screen">
      {/* Optional: A simple Navbar specific to the landing page if needed */}
      <nav className="py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            ScreenRx
          </Link>
          <div className="space-x-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-background to-muted/20">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 animate-fade-in-down">
          Welcome to <span className="text-primary">ScreenRx</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in-up animation-delay-300">
          The intelligent platform designed to streamline your systematic reviews, enhance collaboration, and accelerate your research outcomes.
        </p>
        <div className="animate-fade-in-up animation-delay-600">
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link to="/signup">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Why Choose ScreenRx?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Efficient Screening", description: "Intuitive interfaces for title/abstract and full-text screening with AI-assisted prioritization (future).", icon: <CheckCircle className="h-6 w-6 text-primary mb-2"/> },
              { title: "Seamless Collaboration", description: "Work with your team in real-time, resolve conflicts easily, and track progress transparently.", icon: <CheckCircle className="h-6 w-6 text-primary mb-2"/> },
              { title: "Structured Data Extraction", description: "Customizable forms for consistent data extraction, minimizing errors and improving data quality.", icon: <CheckCircle className="h-6 w-6 text-primary mb-2"/> },
              { title: "Robust RoB Assessment", description: "Integrated tools for various Risk of Bias assessments, tailored to study types.", icon: <CheckCircle className="h-6 w-6 text-primary mb-2"/> },
              { title: "Automated PRISMA Generation", description: "Automatically generate PRISMA flow diagrams from your review data.", icon: <CheckCircle className="h-6 w-6 text-primary mb-2"/> },
              { title: "Centralized Management", description: "Manage all your reviews, team members, and data in one secure platform.", icon: <CheckCircle className="h-6 w-6 text-primary mb-2"/> }
            ].map((feature) => (
              <div key={feature.title} className="p-6 bg-card border rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-center sm:justify-start mb-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} ScreenRx. All rights reserved.
      </footer>
    </div>
  );
};

export default IntroPage;
