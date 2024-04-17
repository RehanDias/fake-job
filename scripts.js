// Define a global variable to store job data
let jobsData = [];

// Define a function to fetch jobs and display them
function fetchJobs() {
   // Fetch job data from JSON file
   fetch("jobsData.json")
      .then((response) => response.json())
      .then((data) => {
         // Store the fetched data in the global variable
         jobsData = data;
         // Display the fetched jobs
         displayJobs(jobsData);
      });
}

// Function to display jobs
function displayJobs(jobs) {
   const jobsList = document.getElementById("jobsList");
   jobsList.innerHTML = ""; // Clear existing job listings

   // Loop through each job and create a job card
   jobs.forEach((job) => {
      const jobCard = createJobCard(job);
      jobsList.appendChild(jobCard);
   });
}

// Function to create a job card
function createJobCard(job) {
   const jobCard = document.createElement("div");
   jobCard.classList.add("col-12", "col-md-6", "job-card");

   // Convert fee to dollar if it's in range format
   let feeDisplay = job.fee;
   if (typeof job.fee === "string" && job.fee.includes("-")) {
      const feeRange = job.fee.split(" - ");
      const minFee = parseFloat(feeRange[0]);
      const maxFee = parseFloat(feeRange[1]);
      feeDisplay = `$${minFee} - $${maxFee}`;
   } else {
      feeDisplay = `$${job.fee}`;
   }

   // Construct HTML for job card
   jobCard.innerHTML = `
        <div class="card">
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <img width="40" height="40" src="https://img.icons8.com/external-sbts2018-blue-sbts2018/58/external-jobs-social-media-basic-1-sbts2018-blue-sbts2018.png" alt="Job Icon"/>
                    <div class="ml-3">
                        <h2 class="card-title">${job.title}</h2>
                        <h3 class="card-text">${job.company}</h3>
                    </div>
                </div>
                <p class="card-text">${job.location}</p>
                <p class="card-text">${formatDate(job.date)}</p>
                <p class="card-text">Fee: ${feeDisplay}</p>
                <div id="details_${job.title.replace(
                   /\s+/g,
                   "_"
                )}" class="job-detail mt-3" style="display: none;">
                    <p>${job.description}</p>
                </div>
            </div>
        </div>
    `;

   // Add event listener to toggle job details visibility
   jobCard.addEventListener("click", function () {
      toggleDetails(job.title);
   });

   return jobCard;
}

// Function to toggle job details visibility
function toggleDetails(title) {
   const detailsDiv = document.getElementById(
      `details_${title.replace(/\s+/g, "_")}`
   );
   const allDetailsDivs = document.querySelectorAll(".job-detail");

   allDetailsDivs.forEach((div) => {
      if (div !== detailsDiv) {
         div.style.display = "none";
      }
   });

   if (detailsDiv.style.display === "none") {
      detailsDiv.style.display = "block";
   } else {
      detailsDiv.style.display = "none";
   }
}

// Function to format date
function formatDate(dateString) {
   const date = new Date(dateString);
   const options = { year: "numeric", month: "long", day: "numeric" };
   return date.toLocaleDateString("en-US", options);
}

// Define a function to handle input change event on search input
function handleSearchInput() {
   let inputField = document.getElementById("searchInput");
   let searchTerm = inputField.value;

   // Regular expression to match any numeric character
   const numericRegex = /\d/;

   // Check if the searchTerm contains any numeric characters
   if (numericRegex.test(searchTerm)) {
      // If numeric characters are found, remove them from the input
      inputField.value = searchTerm.replace(/\d/g, "");

      // Display warning message
      document.getElementById("warningMessage").style.display = "block";
   } else {
      // If no numeric characters are found, hide warning message
      document.getElementById("warningMessage").style.display = "none";

      // Proceed with filtering
      const filteredJobs = jobsData.filter((job) => {
         return (
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase())
         );
      });
      displayJobs(filteredJobs);
   }
}

// Call handleSearchInput function when the search input changes
document
   .getElementById("searchInput")
   .addEventListener("input", handleSearchInput);

// Call fetchJobs function when the page loads
fetchJobs();

// Call handleSearchInput function when the search input changes
document
   .getElementById("searchInput")
   .addEventListener("input", handleSearchInput);

// Call fetchJobs function when the page loads
fetchJobs();
