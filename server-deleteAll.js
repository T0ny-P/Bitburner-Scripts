export async function main(ns) {
	var serverList = [];
	serverList = ns.getPurchasedServers();
	await ns.sleep(50);
	ns.tprint(serverList);
	await ns.sleep(50);
	while(serverList.length != 0){
		var currentServer = serverList.pop();
		ns.tprint(`deleting server ${currentServer}`);
		await ns.sleep(50);
		ns.deleteServer(currentServer);

		await ns.sleep(50);
	}
}