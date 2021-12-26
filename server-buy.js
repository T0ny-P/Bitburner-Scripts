/** @param {NS} ns **/

/**
 * Purchases servers at the specified RAM count.
 * 
 * @todo Update function to accept an Array to buy multiple server and RAM counts in one buy order.
 * @todo Add functionality to allow naming of servers. Currently just creates "home-#" servers
 * 
 * @param {number} serverRam - The amount of RAM in the server purchase.
 * @param {number} [purchaseAmount] - The number of servers you'd like to purchase. Optional.
 * @param {Object} ns - The netscript command object from BitBurners passed in from Main().
 * @return {Array} - A list of created servers.
 */
 export async function serverBuy(serverRam, purchaseAmount, ns) {
    var serverCost = ns.getPurchasedServerCost(serverRam);
    var currentMoney = ns.getServerMoneyAvailable('home');
    var currentServerList = ns.getPurchasedServers();
    var purchasedServerList = [];

    // Determines the number of servers you can buy at the specified RAM count
    if (typeof purchaseAmount === 'undefined' || purchaseAmount === null){
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
    }
    // Determines if you can purchase specified number of servers at the specified RAM amount.
    else{
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
    //Purchase as many servers as possible, up to 25 if server count is not speicified. Otherwise, purchase the stated amount.
    while (0 < purchaseAmount && (currentServerList.length + purchasedServerList.length) < 25 ){
        purchasedServerList.push(ns.purchaseServer("home",serverRam));
        purchaseAmount--;
        var totalServers = (currentServerList.length + purchasedServerList.length);
        await ns.sleep(500);
        ns.tprint(`\n----\nServer purchased!\nServer name: ${purchasedServerList[purchasedServerList.length - 1]}\nServer count: ${totalServers}\n`);
        /**
         * Legacy way of printing
        ns.tprint(`----`);
        ns.tprint(`Server purchased!`)
        ns.tprint(`Server name: ${purchasedServerList[purchasedServerList.length - 1]}`)
        ns.tprint(`Server Count: ${totalServers}`) 
        */
        //ns.tprint(`purchaseAmount var: ${purchaseAmount}`);
        await ns.sleep(500);
        }  

    ns.tprint(`Purchased server list: ${purchasedServerList}`);
    return purchasedServerList;
    } 


export async function main(ns) {
    var serverList = serverBuy(ns.args[0], ns.args[1], ns);
    return serverList;
    } 