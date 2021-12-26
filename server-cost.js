/** @param {NS} ns **/

export async function main(ns) {
    var ramLimit = ns.getPurchasedServerMaxRam();
    var ramCount = 2;

    while(ramCount <= ramLimit) {
        var serverCost = ns.getPurchasedServerCost(ramCount);
        ns.tprint(`The cost of a ${ramCount}GB server is: ${serverCost}`)

        ramCount += ramCount
        await ns.sleep(50)
    }
    return
}