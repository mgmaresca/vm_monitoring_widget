 




 var ip;
if (JSTACK.Keystone.getendpoint(UTILS.Auth.getCurrentRegion(), "network") !== undefined) {
if (model.get("addresses") != null) {
var ips = model.get("addresses")[Object.keys(model.get("addresses"))[0]];
for (var p in ips) {
if (ips[p]['OS-EXT-IPS:type'] === 'floating') {
ip = ips[p].addr;
}
}
}
} else {
if ((model.get("addresses") != null) && (model.get("addresses")["public"] !== null || model.get("addresses")["private"] !== null)) {
ip = model.get("addresses")["public"][0];
}
}
Monitoring.API.getVMmeasures(ip, options.success, options.error, this.getRegion());
break;