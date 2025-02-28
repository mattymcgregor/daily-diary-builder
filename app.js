// Minimal placeholder app
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  
  if (root) {
    root.innerHTML = `
      <div class="container">
        <h1>Inspector Daily Diary</h1>
        <div class="card">
          <div class="header">
            <h2>Diary Header</h2>
          </div>
          <div class="form-group">
            <label class="form-label">Contract Description</label>
            <input type="text" class="form-input" placeholder="Enter contract description" />
          </div>
          <div class="form-group">
            <label class="form-label">Contract Number</label>
            <input type="text" class="form-input" placeholder="Enter contract number" />
          </div>
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" class="form-input" />
          </div>
        </div>
        
        <div class="card">
          <div class="header">
            <h2>Weather Conditions</h2>
          </div>
          <div class="form-group">
            <label class="form-label">Weather Type</label>
            <select class="form-input">
              <option>Dry / Hot</option>
              <option>Humid</option>
              <option>Overcast</option>
              <option>Windy</option>
              <option>Light Rain</option>
              <option>Heavy Rain</option>
              <option>Storms</option>
            </select>
          </div>
        </div>
        
        <div class="card">
          <div class="header">
            <h2>Activity Log</h2>
            <button class="btn btn-outline">Add Activity</button>
          </div>
          <div class="form-group">
            <label class="form-label">Location</label>
            <input type="text" class="form-input" placeholder="Enter location" />
          </div>
          <div class="form-group">
            <label class="form-label">Comments</label>
            <textarea class="form-input" rows="2"></textarea>
          </div>
        </div>
        
        <div style="margin-top: 2rem; text-align: center;">
          <button class="btn btn-outline" style="margin-right: 1rem;">Save Draft</button>
          <button class="btn">Submit to SharePoint</button>
        </div>
      </div>
    `;
  }
});
