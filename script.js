document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const dataTableBody = document.querySelector("#dataTable tbody");
    const selectAllBtn = document.getElementById("selectAllBtn");
    const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
    const paginationContainer = document.getElementById("pagination");
  
    let data = []; // To store the fetched data
    let currentPage = 1; // Current page number
    const rowsPerPage = 10; // Number of rows per page
  
    // here i Fetch data from the endpoint
    fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
      .then(response => response.json())
      .then(jsonData => {
        data = jsonData; // Store the fetched data
        renderTable(); // i Render the table initially
      });
  
    // Render the table based on the current page and search input
    function renderTable() {
      dataTableBody.innerHTML = "";
  
      const searchTerm = searchInput.value.toLowerCase();
  
      // Filter the data based on the search term
      const filteredData = data.filter(row =>
        row.name.toLowerCase().includes(searchTerm) ||
        row.email.toLowerCase().includes(searchTerm) ||
        row.role.toLowerCase().includes(searchTerm)
      );
  
      // Calculate the starting index and ending index of the rows for the current page
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
  
      // Loop through the filtered data and create table rows
      for (let i = startIndex; i < endIndex && i < filteredData.length; i++) {
        const row = filteredData[i];
        const tableRow = document.createElement("tr");
  
        tableRow.innerHTML = `
          <td><input type="checkbox" id="mycheckbox"></input></td>
          <td>${row.name}</td>
          <td>${row.email}</td>
          <td>${row.role}</td>
          <td class="actionbtns">
              <span class="material-symbols-outlined editbtn">edit_square</span>         
              <span class="material-symbols-outlined deletebtn">delete</span>
          </td>
        `;
  
        dataTableBody.appendChild(tableRow);
        
      }
  
      updatePagination(filteredData.length); // Update pagination buttons
    }

    // Update pagination buttons based on the total number of rows
    function updatePagination(totalRows) {
      const totalPages = Math.ceil(totalRows / rowsPerPage);
      paginationContainer.innerHTML = "";
  
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
  
        if (i === currentPage) {
          pageBtn.classList.add("active");
        //   console.log(pageBtn);
        }
  
        pageBtn.addEventListener("click", function() {
          currentPage = i;
          renderTable();
        });
  
        paginationContainer.append(pageBtn);
      }
    }
  
// Search input event listener
searchInput.addEventListener("input", renderTable);
  
  // Table row event listeners for selecting/deselecting rows
dataTableBody.addEventListener("click", function(event) {
    const clickedElement = event.target;
  
    if (clickedElement.tagName === "TR") {
      clickedElement.classList.toggle("selected");
    } 
    else if (clickedElement.tagName === "BUTTON") {
      const row = clickedElement.closest("tr");
      row.classList.toggle("selected");
    }
  
    const allCheckboxes = dataTableBody.querySelectorAll("input[type='checkbox']");
    const selectedCheckboxes = dataTableBody.querySelectorAll("tr.selected input[type='checkbox']");
  
    selectAllBtn.checked = allCheckboxes.length === selectedCheckboxes.length;
  });
})

