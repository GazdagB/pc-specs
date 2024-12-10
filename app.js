//Import the needed modules
import chalk from 'chalk';
import boxen from 'boxen';
import figlet from 'figlet';
import si from 'systeminformation';
import ora from "ora"

function displayTitle(){
    const ASCIIArt = `
                  .----.
      .---------. | == |
      |.-"""""-.| |----|
      ||       || | == |
      ||       || |----|
      |'-.....-'| |::::|
      '"")---(""' |___.|
     /:::::::::::\" _  "
    /:::=======:::\`\`\

    """"""""""""".:...
    
        `

      console.log(chalk.magenta(ASCIIArt));
      console.log(chalk.cyan(figlet.textSync('PC Specs', { horizontalLayout: 'full' })));
}

displayTitle()


async function getSystemSpecs() {

    const spinner = ora("⏳ Loading system specs...").start()

    try {

        
        const cpu = await si.cpu();
        const graphics = await si.graphics();
        const os = await si.osInfo();
        const memory = await si.mem();
        const storage = await si.diskLayout();
        const uptime = si.time()
        

        spinner.succeed("✅ System specs fetched successfully!")

        const specsStrings = {
            os: `${os.distro} ${os.arch} v${os.release}`,
            uptime: `${Math.floor(uptime.uptime / 3600)}h ${Math.floor((uptime.uptime % 3600) / 60)}m`,
            cpu: `${cpu.manufacturer} ${cpu.brand} ${cpu.speedMax}Ghz ${cpu.socket}`,
            graphics: graphics.controllers
              .map(
                (g) =>
                  `${g.model} ${Math.round(g.vram / 1024)}GB ${(
                    g.memoryUsed / 1024
                  ).toFixed(1)}GB/${Math.round(g.vram / 1024)}GB Used`
              )
              .join(', '),
            storage: storage
              .map((s) => {
                if (s.vendor) {
                  return `${s.vendor} ${s.type == 'HD' ? 'HDD' : s.type} ${Math.round(
                    s.size / 1e9
                  )}GB ${s.interfaceType}`;
                } else if (!s.vendor) {
                  return `${s.name} ${s.type == 'HD' ? 'HDD' : s.type} ${Math.round(
                    s.size / 1e9
                  )}GB ${s.interfaceType}`;
                }
              })
              .join(', '),
            memory: `Total RAM: ${Math.round(memory.total / 1e9)}GB ${Math.round(
              memory.used / 1e9
            )}GB/${Math.round(memory.total / 1e9)}GB Used`,
          };
        
          return specsStrings;


    } catch (error) {
        spinner.fail("❌ Failed to fetch system specs.")
        console.error(error.message)
        process.exit(1)
    }

}

function displaySpecs(specs) {
    const formattedSpecs = `
  💿 OS: ${chalk.green(specs.os)}
  🧠 CPU: ${chalk.green(specs.cpu)}
  💻 Memory: ${chalk.green(specs.memory)}
  🎮 Graphics: ${chalk.green(specs.graphics)}
  ⌚ PC UPTIME: ${chalk.green(specs.uptime)}
  📦 Storage: ${chalk.green(specs.storage)}
    `;
  
    console.log(
      boxen(formattedSpecs, { padding: 1, margin: 1, borderStyle: 'round' })
    );
  }

displaySpecs(await getSystemSpecs())


