import PageTemplate from './Template'
import '../css/About.css';

function App() {
  return (
    <>
      <PageTemplate highLight="1" />
      <ul className="ProfileStatsBox">
                <h1>About Us</h1>
                <div className="ProfileStatsBoxGroup">
                    <h2>Who We Are</h2>
                    <li>This was done as a group project for ITCS 4152 at University of North Carolina at Charlotte. This product identifies plastic objects as recyclable or non-recyclable based on it's material type. We hope this helps people to properly recycle their trash and reduce global pollution. Below are the contributers...</li>
                </div>
                <div className="ProfileStatsBoxGroup">
                    <h2>Michael Phelps</h2>
                    <li>Research</li>
                    <li>Development and Training of Wadaba/DuckDuckGo Models</li>
                    <li>Collection of Data</li>
                </div>
                <div className="ProfileStatsBoxGroup">
                    <h2>Thomas Carr</h2>
                    <li>Demo Website Front/Backend</li>
                    <li>Research</li>
                    <li>Collection/Organization of Data</li>
                </div>
                <div className="ProfileStatsBoxGroup">
                    <h2>Junior Sangvacharakul</h2>
                    <li>Research</li>
                    <li>Aided in Wadaba Model Development</li>
                </div>
                <div className="ProfileStatsBoxGroup">
                    <h2>Harrison Lee</h2>
                    <li>Research</li>
                    <li>Retrieved Access to WaDaBa Dataset</li>
                    <li>Development and Training of Wadaba+ Model</li>
                    <li>Model Testing</li>
                </div>
                <div className="ProfileStatsBoxGroup">
                    <h2>Matthew Thayer</h2>
                    <li>Research</li>
                    <li>Model's Metrics Visualization</li>
                    <li>Collection of Data</li>
                </div>
                <div className="ProfileStatsBoxGroup">
                    <h2>Sindhura Chaganti</h2>
                    <li>Research</li>
                </div>
                <h1> </h1>
                <h1> </h1>
            </ul>
    </>
  );
}

export default App;
