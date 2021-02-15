
require('../common-node/global-require');
const heroku_environment = rootAppRequire('common-node/check-start/heroku-environment');
heroku_environment.processEnvVars();

rootAppRequire('node__webserver/web-server-80')




const BOLT_URI_7687= process.env.BOLT_URI_7687; 

const NEO4J_BROWSER_7474= process.env.NEO4J_BROWSER_7474; 

const SPACES_NEO4J_USERNAME= process.env.NEO4J_USERNAME; 
const SPACES_INIT_NEO4J_PASSWORD= process.env.INIT_NEO4J_PASSWORD; 


const OUTSIDE_HTML_PORT_80= process.env.OUTSIDE_HTML_PORT_80; 

const NEO4J_USERNAME= SPACES_NEO4J_USERNAME.trim(); 
const INIT_NEO4J_PASSWORD= SPACES_INIT_NEO4J_PASSWORD.trim(); 







const DB_BROWSER_URI = `DB Browser     ~ http://localhost:${NEO4J_BROWSER_7474}/browser/`;    
const DB_CONNECT_URL = `DB Connect URL ~ neo4j://       localhost:${BOLT_URI_7687}`;    
const DB_USERNAME    = `DB Username    ~ ${NEO4J_USERNAME}`;    
const DB_PASSWORD    = `DB Password    ~ ${INIT_NEO4J_PASSWORD}`;    
const HTML_PROGRAM   = `Web Page       ~ http://localhost:${OUTSIDE_HTML_PORT_80}/`;       

console.log('\n  \033[93m  DB_BROWSER_URI *****', DB_BROWSER_URI, '\033[0m');
console.log(  '  \033[93m  DB_CONNECT_URL *****', DB_CONNECT_URL, '\033[0m');
console.log(  '  \033[93m  DB_USERNAME    *****', DB_USERNAME,    '\033[0m');
console.log(  '  \033[93m  DB_PASSWORD    *****', DB_PASSWORD,    '\033[0m');
console.log(  '  \033[93m  HTML_PROGRAM   *****', HTML_PROGRAM,   '\033[0m\n');



