export default function SubscripersList(){
    return (        
        <div className="dashboard">
            <h1>Subscription List</h1>
            {/* Search Subscribers */}
            <div className="search-container">
              <h2>Search Subscribers</h2>
              <input
                type="text"
                placeholder="Search by ID or name..."
              />
            </div>

            {/* Subscribers Table */}
            <div className="table-container">
              <h2>Subscribers List</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Days Remaining</th>
                    <th>Start Date</th>
                    <th>Status</th>
                    <th>End Date</th>
                    <th>Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
        </div>
    )
}