// Create variables for buttons

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const intradayBtn = document.getElementById('intraday');
const dailyBtn = document.getElementById('daily');
const weeklyBtn = document.getElementById('weekly');
const monthlyBtn = document.getElementById('monthly');
const typeBtn = document.querySelectorAll('.btn');

const removeBtn = document.getElementById('remove');

const listContainer = document.getElementById('items');

const modal = document.getElementById('modal');



// Listener for active button

typeBtn.forEach((item)=>{
    item.addEventListener('click',()=>{
        changeActiveItem();
        item.classList.add('active');
        // console.log(item);
        // console.log(item.value);
    })
})

const changeActiveItem =()=>{
    typeBtn.forEach((item)=>{
        item.classList.remove('active');
    })
}

// search-btn function

// urlPart=type 
// for now let type=daily

searchBtn.addEventListener('click',function(){
    let symbol = searchInput.value.toUpperCase();
    let type;
    try{
        type=document.querySelector('.btn.active').value;
        // console.log(type);
        searchInput.value='';
    }catch(error){
        searchInput.value="";
    }
    // console.log(symbol);
    fetchData(symbol,type);
})

// fetchData function

async function fetchData(symbol,type){

    let getData2 = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_${type}&symbol=${symbol}&interval=5min&apikey=1SKFE1N4O6EBGFNF`) ;

    let getData = await getData2.json();

    // console.log(getData);

    // console.log(symbol);
    let chartType = getData["Meta Data"]["1. Information"].split(" ")[0];
    console.log(chartType);

    let mainKeys = Object.keys(getData);
    // console.log(mainKeys);
    // console.log(mainKeys[1]);

    let timeSeriesData = getData[mainKeys[1]];
    // console.log(timeSeriesData);

    let dates = Object.keys(timeSeriesData);
    // console.log(dates);

    let currentPrice = timeSeriesData[dates[0]]["1. open"];
    console.log(currentPrice);

    let oldPrice = timeSeriesData[dates[1]]['1. open'];
    console.log(oldPrice);


    newListElement(getData,symbol,chartType,currentPrice,oldPrice);

    
}

//  function to add new list

function newListElement(getData,symbol,chartType,currentPrice,oldPrice){
    currentPrice=Number(currentPrice).toFixed(2);
    chartType=chartType.toUpperCase();
    let li = document.createElement('li');
    li.classList.add('open-modal');
    li.innerHTML=`<span id="item-symbol">${symbol}</span>
    <span id="item-price">${currentPrice}</span>
    <span id="item-filter">${chartType}</span>
    <button id="remove" onclick="closeElement(event)"><i class="fa-solid fa-remove"></i></button>`;

    listContainer.appendChild(li);

    //to add data in modal


    let modalTable= document.createElement('table');
    modalTable.id = 'modal-table';

    let modalTableHeading = document.createElement('thead');
    modalTableHeading.id='modal-table-heading';

    modalTableHeading.innerHTML=`<th>DATE</th>
    <th>OPEN</th>
    <th>HIGH</th>
    <th>LOW</th>
    <th>CLOSE</th>
    <th>VOLUME</th>`;

    modalTable.appendChild(modalTableHeading);
    // console.log(modalTable);
    modal.appendChild(modalTable);
    document.querySelector('.watchlist').appendChild(modal);

    // fetchin table details

    let modalGetDataKeys = Object.keys(getData);
    console.log(modalGetDataKeys);

    let modalGetDataKeysValue = getData[modalGetDataKeys[1]];
    console.log(modalGetDataKeysValue);

    let modalKeys = Object.keys(modalGetDataKeysValue);
    console.log(modalKeys);

    let modalValues = Object.values(modalGetDataKeysValue);
    console.log(modalValues[0]["1. open"]);
    console.log(chartType);

    let tableBody = document.createElement('tbody');
    tableBody.id='modal-table-data';
    for(i=0; i<5; i++){
    let tr = document.createElement('tr');


    if(chartType==="DAILY"){
    tr.innerHTML=`<td>${modalKeys[i]}</td>
    <td>${modalValues[i]["1. open"]}</td>
    <td>${modalValues[i]["2. high"]}</td>
    <td>${modalValues[i]["3. low"]}</td>
    <td>${modalValues[i]["4. close"]}</td>
    <td>${modalValues[i]["6. volume"]}</td>`
    }else if(chartType==="INTRADAY"){
    tr.innerHTML=`<td>${modalKeys[i].slice(10,)}</td>
    <td>${modalValues[i]["1. open"]}</td>
    <td>${modalValues[i]["2. high"]}</td>
    <td>${modalValues[i]["3. low"]}</td>
    <td>${modalValues[i]["4. close"]}</td>
    <td>${modalValues[i]["5. volume"]}</td>`}
    else{
        tr.innerHTML=`<td>${modalKeys[i]}</td>
    <td>${modalValues[i]["1. open"]}</td>
    <td>${modalValues[i]["2. high"]}</td>
    <td>${modalValues[i]["3. low"]}</td>
    <td>${modalValues[i]["4. close"]}</td>
    <td>${modalValues[i]["5. volume"]}</td>`
    }

    tableBody.appendChild(tr);
    }
    modalTable.appendChild(tableBody);

    
    // function to open modal
    let openModal = document.querySelector('.open-modal');

    openModal.addEventListener('click',function(e){
        let target = e.target.tagName;
        console.log(target);
        if(target==='SPAN'){
            modal.style.display='block';
        }
    })


    

}

// function to remove list
function closeElement(event){
    let clickedElement = event.target;
    console.log(clickedElement.parentElement);
    clickedElement.parentElement.remove();
}



// function to close modal
window.addEventListener('click',function(e){
    console.log(e.target);
    if(e.target === modal){
        // console.log(modal);
        modal.style.display='none';
    }
})


