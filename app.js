//Import the needed modules
import chalk from "chalk";
import boxen from "boxen"
import figlet from "figlet";
import si from "systeminformation"


async function getSystemSpecs(){
    
        const cpu = await si.cpu()
        const graphics = await si.graphics()
        const os = await si.osInfo()
        const memory = await si.mem()
        const storage = await si.diskLayout()
    

    const specsStrings ={
        os: `${os.distro} ${os.arch} v${os.release}`,
        cpu: `${cpu.manufacturer} ${cpu.brand} ${cpu.speedMax}Ghz ${cpu.socket}`,
        graphics: graphics.controllers.map((g)=> `${g.model} ${Math.round(g.vram / 1024)}GB ${(g.memoryUsed / 1024).toFixed(1)}GB/${Math.round(g.vram / 1024)}GB Used`).join(", "),
        storage: storage.map((s)=>{
            if(s.vendor){
               return `${s.vendor} ${s.type  == 'HD' ? "HDD" : s.type} ${Math.round(s.size / 1e9)}GB ${s.interfaceType}`
            }else if(!s.vendor){
               return `${s.name} ${s.type  == 'HD' ? "HDD" : s.type} ${Math.round(s.size / 1e9)}GB ${s.interfaceType}`
            }
        }).join(", "),
        memory: `Total RAM: ${Math.round(memory.total / 1e9)}GB ${Math.round(memory.used / 1e9)}GB/${Math.round(memory.total / 1e9)}GB Used`
    }

    return specsStrings;
}

console.log(await getSystemSpecs())