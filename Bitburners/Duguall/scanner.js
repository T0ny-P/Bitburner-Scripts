/** @param {NS} ns **/
export async function main(ns) {

    var servers = ["home"]; //Queue for querying all servers for scan
    var serverList = {} //list of server objects
    var serverDisplay = ["home"] //quick hack to decide display order of servers when printing
    //declaring a server object for the HTML loop to pull information from
    var serverObj = (
        root = false,
        hackLevel = 1,
        ports = 0,
        ram = 0,
        money = 0,
        moneyMax = 0,
        security = 1,
        securityMin = 1,
        path = ["home"],
        profit = 0
    ) => ({
        root: root,
        hackLevel: hackLevel,
        ports: ports,
        ram: ram,
        money: money,
        moneyMax: moneyMax,
        security: security,
        securityMin: securityMin,
        path: path,
        profit: profit
    });

//Manually making a "Home" object to jumpstart the loop.
    serverList["home"] = serverObj(true, 1, 0, ns.getServerMaxRam("home"), 0, 0, 1, 1, ["home"], 0);
    var i;
    /*Every scanned server is added to servers. As the loop 'pops' it, it deletes the last server in the list
    until all servers have been queued and popped*/
    while (i = servers.pop()) {
        var tempServers = ns.scan(i);
        if (i == "home") {tempServers.push("n00dles")}; //quick hack to fix skipping n00dles during next loop
        //j = 1 in order to skip the first scan of a server, the parent server it originated from
        for (var j = 1; j < tempServers.length; j++) {
            //Determine profitability of a server in relation to max money and Security level (Difficulty)
            var serverInfo = ns.getServer(tempServers[j])
            serverInfo.moneyAvailable = serverInfo.moneyMax
            serverInfo.hackDifficulty = serverInfo.minDifficulty
            if (ns.fileExists("Formulas.exe")) {
                var timeWeaken = ns.formulas.hacking.weakenTime(serverInfo, ns.getPlayer());
            } else {
                var timeWeaken = ns.getWeakenTime(tempServers[j])
            }
            var profitPredict = serverInfo.moneyAvailable / (timeWeaken/1000)
            if (isNaN(profitPredict) || !isFinite(profitPredict)) {profitPredict = 0}
            //Populate server object with useful information for display
            serverList[tempServers[j]] = serverObj(
                ns.hasRootAccess(tempServers[j]),
                ns.getServerRequiredHackingLevel(tempServers[j]), 
                ns.getServerNumPortsRequired(tempServers[j]),
                ns.getServerMaxRam(tempServers[j]),
                ns.getServerMoneyAvailable(tempServers[j]),
                ns.getServerMaxMoney(tempServers[j]),
                ns.getServerSecurityLevel(tempServers[j]),
                ns.getServerMinSecurityLevel(tempServers[j]),
                Object.values(serverList[i].path),
                Intl.NumberFormat("en-US", {notation: "compact"}).format(profitPredict)
                );
                //Inherits the path of parent, and then adds itself to end of path for auto-connect
                serverList[tempServers[j]].path.push(tempServers[j]);
                servers.push(tempServers[j]);
                //injects server into display order to be right behind parent
                serverDisplay.splice(serverDisplay.findIndex(element => element == i) + 1, 0, tempServers[j])
        };
    };
    //Next ~15 lines determines color and logic of display elements
    var cracks = 0;
    if (ns.fileExists("BruteSSH.exe", "home")) {cracks++};
    if (ns.fileExists("FTPCrack.exe", "home")) {cracks++};
    if (ns.fileExists("relaySMTP.exe", "home")) {cracks++};
    if (ns.fileExists("HTTPWorm.exe", "home")) {cracks++};
    if (ns.fileExists("SQLInject.exe", "home")) {cracks++};
    var output = ""
    serverDisplay.forEach(server => {
        var rootColor = serverList[server].root ? "Lime" : "Red";
        var hackingColor = (ns.getHackingLevel() > serverList[server].hackLevel) ? "Lime" : "Red";
        var portColor = (cracks >= serverList[server].ports) ? "Lime" : "Red";
        var nameColor = "White";
        var moneyPercent = Math.round(100 * serverList[server].money / serverList[server].moneyMax)
        if (isNaN(moneyPercent)) { moneyPercent = 0}
        var money = Math.round(serverList[server].money)
        var compactMoney = Intl.NumberFormat("en-US", {notation: "compact"}).format(money)
        //terminal command for connect <server> in sequence
        var pathConnect = ""
        serverList[server].path.forEach(element =>{
            pathConnect += "connect " + element + ";"
        })
        //indenting of columns based on length of strings
        var serverLine = "-".repeat(serverList[server].path.length - 1)
        var ramLine = "-".repeat(40 - (serverList[server].path.length - 1) - (server.length) - (serverList[server].hackLevel.toString().length) - (serverList[server].ports.toString().length))         
        var moneyLine = "-".repeat(10 - (serverList[server].ram.toString().length))
        var secLine = "-".repeat(10 - (compactMoney.toString().length) - (moneyPercent.toString().length))
        var profitLine = "-".repeat(10 - (Math.round(serverList[server].security).toString().length) - (Math.round(serverList[server].securityMin).toString().length))
        //Output of all lines are entered at once. So output += onto itself until every server is added.
        output += [
                `<br>`,
                //server name and onClick function. Selects Terminal Input to copy connect, selects input, hits enter.
                `<a style='font-family:Lucida Console'>${serverLine}</a>`,
                `<a onClick="(function()
            {
                const terminalInput = document.getElementById('terminal-input');
                terminalInput.value='home;${pathConnect}';
                const handler = Object.keys(terminalInput)[1];
                terminalInput[handler].onChange({target:terminalInput});
                terminalInput[handler].onKeyDown({keyCode:13,preventDefault:()=>null});
            })();"
                style='color:${nameColor};font-family:Lucida Console'>${server}</a> `,
                `<a style='color:${rootColor};font-family:Lucida Console''>R</a> `,
                `<a style='color:${hackingColor};font-family:Lucida Console''>H:${serverList[server].hackLevel}</a> `,
                `<a style='color:${portColor};font-family:Lucida Console''>P:${serverList[server].ports}</a>`,
                `<a style='color:Black;font-family:Lucida Console''>${ramLine}</a>`,                
                `<a style='color:Gray;font-family:Lucida Console''>RAM:${serverList[server].ram}GB</a>`,
                `<a style='color:Black;font-family:Lucida Console''>${moneyLine}</a>`,                
                `<a style='color:Gray;font-family:Lucida Console''>Money:${compactMoney}(${moneyPercent}%)</a>`,
                `<a style='color:Black;font-family:Lucida Console''>${secLine}</a>`,                
                `<a style='color:Gray;font-family:Lucida Console''>Sec:${Math.round(serverList[server].security)}/${serverList[server].securityMin}</a>`,                
                `<a style='color:Black;font-family:Lucida Console''>${profitLine}</a>`,                
                `<a style='color:Gray;font-family:Lucida Console''>Profit:${serverList[server].profit}/sec</a>`,

                ].join("")
    })

    //document.getElementById() costs 20GB of RAM. A pointer to the same place doesn't. Go figure
    const doc = eval("document")
    const list = doc.getElementById("terminal");
    //Inserts huge output to bottom of terminal display
    list.insertAdjacentHTML('beforeend', output);
};