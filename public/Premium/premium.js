const monthly=document.getElementById('monthly')
const yearly=document.getElementById('yearly')
const queryString=window.location.search;
const urlParams=new URLSearchParams(queryString);
const year=urlParams.get('year');
const month=urlParams.get('month');
const token=localStorage.getItem('token');
const Obj={
    year: year,
    month: month
}
const Obj1={};
document.getElementById('year').textContent=`${year}`
const months=['January','February','March','April','May','June','July','August','September','October','November','December']
document.getElementById('month-year').textContent=`${months[(+month)-1]} ${year}`
document.getElementById('date').textContent=`${new Date()}`

async function getMonthlyReport(){
    const report=await axios.get(`${API_ENDPOINT}premium/monthlyreport`,{params: Obj,headers:{"authorization": token}});
    let totalIncome=0
    let totalExpense=0
    console.log(report.data)
    Obj1.monthlyReport=report.data;
    report.data.forEach(data => {
        var tr=document.createElement('tr');
        var td1=document.createElement('td');
        td1.appendChild(document.createTextNode(data.date))
        var td2=document.createElement('td');
        td2.appendChild(document.createTextNode(data.description))
        var td3=document.createElement('td');
        td3.appendChild(document.createTextNode(data.category))
        var td4=document.createElement('td');
        td4.appendChild(document.createTextNode(data.income))
        var td5=document.createElement('td');
        td5.appendChild(document.createTextNode(data.expense))
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        tr.appendChild(td5)
        monthly.appendChild(tr)
        totalIncome=totalIncome+(+data.income)
        totalExpense=totalExpense+(+data.expense)
    });
    var tr=document.createElement('tr');
    var td1=document.createElement('td');
    var td2=document.createElement('td');
    var td3=document.createElement('td');
    var td4=document.createElement('td');
    td4.appendChild(document.createTextNode(`₹ ${totalIncome}`))
    var td5=document.createElement('td');
    td5.appendChild(document.createTextNode(`₹ ${totalExpense}`))
    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    tr.appendChild(td4)
    tr.appendChild(td5)
    monthly.appendChild(tr) 
    tr=document.createElement('tr');
    td1=document.createElement('td');
    td1.colSpan=5;
    td1.textContent=`Savings = ₹${totalIncome-totalExpense}`
    td1.style.textAlign='right';
    tr.appendChild(td1);
    monthly.appendChild(tr) 
}

async function getYearlyReport(){
    const report=await axios.get(`${API_ENDPOINT}premium/yearlyreport`,{params: Obj,headers:{"authorization": token}});
    let totalIncome=0
    let totalExpense=0
    let totalSavings=0
    Obj1.yearlyReport=report.data;
    report.data.forEach(data => {
        var tr=document.createElement('tr');
        var td1=document.createElement('td');
        td1.appendChild(document.createTextNode(months[data.month]))
        var td2=document.createElement('td');
        td2.appendChild(document.createTextNode(data.income))
        var td3=document.createElement('td');
        td3.appendChild(document.createTextNode(data.expense))
        var td4=document.createElement('td');
        td4.appendChild(document.createTextNode(data.savings))
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        yearly.appendChild(tr)
        totalIncome=totalIncome+(+data.income)
        totalExpense=totalExpense+(+data.expense)
        totalSavings=totalSavings+(+data.savings)
    });
    var tr=document.createElement('tr');
    var td=document.createElement('td');
    var td2=document.createElement('td');
    td2.appendChild(document.createTextNode(totalIncome))
    var td3=document.createElement('td');
    td3.appendChild(document.createTextNode(totalExpense))
    var td4=document.createElement('td');
    td4.appendChild(document.createTextNode(totalSavings))
    tr.appendChild(td)
    tr.appendChild(td2)
    tr.appendChild(td3)
    tr.appendChild(td4)
    yearly.appendChild(tr) 
}




window.addEventListener('DOMContentLoaded',()=>{
    getMonthlyReport();
    getYearlyReport();
    })

async function download(){
    try{
        const response=await axios.get(`${API_ENDPOINT}premium/download`,{params: Obj1,headers:{"authorization": token}});
        if(response.status==200){
            var a=document.createElement("a");
            a.href=response.data.fileUrl;
            a.download='myexpense'
            a.click();
        }
    }catch(err){
        alert("Something Went wrong ",err)
    }
    
    // const element = document.body;
    // html2pdf()
    //     .from(element)
    //     .set({ 
    //         filename: `report${months[(+month)-1]}-${year}.pdf`,
    //         html2canvas: { scale: 2 },
    //         jsPDF: { unit: 'pt', format: 'a4', orientation: 'landscape' } // Set PDF format and orientation
    //     })
    //     .save();    
}