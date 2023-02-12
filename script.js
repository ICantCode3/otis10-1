const input = document.getElementById("file-input");
const maintenanceBody = document.getElementById("maintenance-body");

const readExcelData = () => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      resolve(XLSX.utils.sheet_to_json(worksheet, { header: 1 }));
    };
    reader.readAsBinaryString(input.files[0]);
  });
};

input.addEventListener("change", async () => {
  maintenanceBody.innerHTML = "";
  const data = await readExcelData();
  data.forEach(([countryCode, customerId, contractNo]) => {
    fetchData(countryCode, customerId, contractNo);
  });
});

const fetchData = (countryCode, customerId, contractNo) => {
  fetch(
    `https://developer-portal-api-stage.otiselevator.com/elevatormaintenance/api/latestmaintenanceinfo?country_code=${countryCode}&customer_id=${customerId}&contract_no=${contractNo}`
  )
    .then(response => response.json())
    .then(data => {
      data.forEach(maintenanceInfo => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${maintenanceInfo.elevator_id}</td>
          <td>${maintenanceInfo.maintenance_type}</td>
          <td>${maintenanceInfo.maintenance_date}</td>
        `;
        maintenanceBody.appendChild(row);
      });
   
