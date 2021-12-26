/** @param {NS} ns **/

export async function main(ns) {
	var myScript = ns.args[0];
	var scriptRam = ns.getScriptRam(myScript);
	var serverList = ns.getPurchasedServers();

	while(serverList.length != 0){
		var currentServer = serverList.pop();
		var serverRam = ns.getServerMaxRam(currentServer);
		var scriptThreads = Math.trunc((serverRam/scriptRam));
		ns.tprint(`Kill any currently running scripts on ${currentServer}.`);
		ns.killall(currentServer);
		ns.tprint(`Copying ${myScript} to ${currentServer}`);
		await ns.scp(myScript, currentServer);
		ns.tprint(`Running ${myScript} in ${scriptThreads} threads.`);
		ns.exec(myScript,currentServer,scriptThreads,ns.args[1]);
		await ns.sleep(50);

	}
}