const xlsx = require('xlsx');
const axios = require('axios');

const excelFilePath = './12-boys-science-inactive.xlsx';
const apiEndpoint = 'http://localhost:8080/api/student/addstudent';
const workbook = xlsx.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0];
const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

const headers = rawData[1]; 
const dataRows = rawData.slice(2); 

const cleanData = dataRows.map(row => {
    const rowData = {};
    headers.forEach((header, index) => {
        if (header) {
            rowData[header] = row[index]; 
        }
    });
    return rowData;
});

const mapExcelToRequestBody = (row) => {
    const parseDate = (dateString) => {
        if (!dateString) return null;
        const [day, month, year] = dateString.split('-');
        return new Date(`${year}-${month}-${day}`);
    };

    const formatPhone = (phoneNumber) => {
        if (!phoneNumber) return null;
        if (phoneNumber.length>=10){
        const digits = phoneNumber.replace(/\D/g, '').slice(-10);
        return digits ? `+92${digits}` : null;
        }
        else{
            return phoneNumber
        }
    };

    return {
        first_name: row['Name'] || '',
        last_name: row['Surname'] || '',
        gender: row['Gender'] || '',
        birthdate: parseDate(row['Birthday']),
        city: row['Place Of Birth'] || '',
        address: row['Address'] || '',
        roll_num: row['Student Code'] || '',
        father_name: row['Father'] || '',
        father_cnic: row['Father ID'] || '',
        father_phone: formatPhone(row['Father Phone']),
        mother_phone: formatPhone(row['Mother Phone']),
        class: '12th',
        monthly_fee: row['Monthly Fee'] || 0,
        section: '',
        field: 'Science',
        status: 'inactive',
    };
};

const processExcelData = async () => {
    for (const row of cleanData) {
       
        try {
            const requestBody = mapExcelToRequestBody(row);

            const response = await axios.post(apiEndpoint, requestBody);
            console.log(`Successfully added: ${requestBody.first_name} ${requestBody.last_name}`);
        } catch (err) {
            console.error(`Failed to add student: ${row['Name']} ${row['Surname']}`, err.message);
        }
    }
};

// Start the process
processExcelData()
    .then(() => console.log('All students processed.'))
    .catch((err) => console.error('Error processing students:', err));
