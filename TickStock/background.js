
const API_KEY = "MJXVQCDEHYMJLFQX";
const stocks = ["AAPL", "GOOGL"];

async function fetchStockPrice(symbol){
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    console.log("API URL:", url);
    try{
    const response = await fetch(url);
    const data = await response.json();
    console.log("API Response:", data);
    
    if(data["Global Quote"]){
        return data["Global Quote"] ["05. price"];
    }else{
        console.error("Error fetching data:", data);
        return null;
    }
}
 catch (error){
    console.error("Network or API error:", error);
    return null;
}
}


chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create("dailyUpdate", {periodInMinutes: 1440});
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if(alarm.name === "dailyUpdate"){
        updateStockPrices();
    }
});

async function updateStockPrices(){
    const stocks = ["AAPL", "GOOGL"]; //need to add stock symbols.
    const stockPrices = await Promise.all(stocks.map(fetchStockPrice));
    sendNotification(stockPrices);
}

function sendNotification(stockPrices){
    const message = stockPrices
    .map((price,index) => `Stock ${stocks[index]}: $${price}`)
    .join("\n");


chrome.notifications.create({
    type: "basic",

    title: "Daily Stock Update",
    message: message,
});
}