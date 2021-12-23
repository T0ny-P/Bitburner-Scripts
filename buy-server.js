export async function main(ns) {
    var serverRam = ns.args[0];
    var serverCost = ns.getPurchasedServerCost(serverRam);
    var currentMoney = ns.getServerMoneyAvailable('home');
    var currentServerList = ns.getPurchasedServers();
    var purchasedServerList = [];

    if (typeof ns.args[1] === 'undefined' || ns.args[1] === null){
        var purchaseAmount = Math.trunc((currentMoney/serverCost));
        if (purchaseAmount > (25 - currentServerList.length)) {
            purchaseAmount = (25 - currentServerList.length)
        }
        var purchaseTotal = purchaseAmount * serverCost;
        ns.tprint(`Total Amount: ${purchaseTotal}. Buying ${purchaseAmount}, ${serverRam}GB servers @ \$${serverCost} each.`)
        await ns.sleep(500)
        ns.tprint(`Current Money: \$${currentMoney}.`)
        await ns.sleep(500)
        
        if (purchaseAmount <= 0){
            await ns.tprint(`You don't have enough money to purchase any ${serverRam}GB servers.`);
            return null;
        }
    }else{
        var purchaseAmount = ns.args[1];
        var purchaseTotal = purchaseAmount * serverCost;
        ns.tprint(`Total Amount: ${purchaseTotal}. Buying ${purchaseAmount}, ${serverRam}GB servers @ \$${serverCost} each.`)
        await ns.sleep(500)
        ns.tprint(`Current Money: \$${currentMoney}.`)
        await ns.sleep(500)
        if (currentMoney < purchaseTotal){
            await ns.tprint(`You don't have enough money to purchase ${purchaseAmount}\, ${serverRam}GB servers.`)
            return null
        }
    }
    
    while (0 < purchaseAmount && (currentServerList.length + purchasedServerList.length) < 25 ){
        purchasedServerList.push(ns.purchaseServer("home",serverRam));
        purchaseAmount--;
        var totalServers = (currentServerList.length + purchasedServerList.length);
        await ns.sleep(500);
        ns.tprint(`Total Servers: ${totalServers}`);
        ns.tprint(`purchaseAmount var: ${purchaseAmount}`);
        await ns.sleep(500);
        ns.tprint(`Purchased Server: ${purchasedServerList}`);
        }  
    return purchasedServerList;
    } 