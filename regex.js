export const GruposRegex = {
    CARGO :  { 
        palabras : ['cloud architect','back-end','front-end','android','node.js','.net','django','react.js','vue.js','front end','back end','devops','backend','frontend','intern','sr','senior','jefe','oracle','lider','product owner','lead','analista qa','product manager','practica','site reliability engineer','sre','software engineer','data scientist','fullstack','full stack','us$','scrum master'] ,
        regex : null
    },
    
    TECNOLOGIA : {
        palabras : ['html', 'css', 'javascript', 'python', 'java', 'c++', 'sql', 'ruby', 'php', 'swift', 'kotlin', 'typescript', 'go', 'rust', 'perl', 'matlab', 'c#', 'scala', 'bash', 'shell scripting', 'node.js', 'react', 'angular', 'vue.js', 'django', 'flask', 'ruby on rails', 'spring framework', 'hibernate', 'express.js', 'flask restful', 'asp.net', '.net core', 'laravel', 'cakephp', 'symfony', 'yii', 'rubymotion', 'ionic', 'xamarin', 'android sdk', 'ios sdk', 'react native', 'unity', 'unreal engine', 'tensorflow', 'keras', 'pytorch', 'opencv', 'docker', 'kubernetes', 'amazon web services (aws)', 'microsoft azure', 'google cloud platform', 'heroku', 'digitalocean', 'git', 'svn', 'mercurial', 'jenkins', 'travis ci', 'circleci', 'jira', 'trello', 'asana', 'slack', 'zoom', 'skype', 'microsoft teams', 'google meet', 'zoom', 'postgresql', 'mysql', 'mongodb', 'sqlite', 'oracle', 'microsoft sql server', 'mariadb', 'redis', 'cassandra', 'neo4j', 'couchbase', 'apache kafka', 'rabbitmq', 'elasticsearch', 'logstash', 'kibana', 'grafana', 'prometheus', 'nagios', 'splunk', 'graylog', 'wireshark', 'nmap', 'metasploit', 'burp suite', 'owasp zap', 'hashcat', 'john the ripper', 'aircrack-ng'] ,
        regex : null
    } ,
    EMPRESA  : {
        palabras : ['braintrust','listopro','turing','oowlish','fullStack labs'],
        regex : null
    },
    BUSQUEDA  :  {
        palabras : ['python','sql','excel','power bi'],
        regex : null
    }
}

export const regex_experiencia_empleo = /(?:maximo |entre |al menos |minimo |desde |experiencia |[+]\s?|contar con )(?:de |de al menos |minima de |hasta )?[+]?(\d{1,2})(?:[aoy\- ]{1,3}(\d{1,2}))? ano[s]?(?:(?: de experiencia(?: laboral previa| en el cargo| minima| en cargos similares| en \w+| como \w+| comprobable))|(?: en el cargo| en cargos similares| en roles similares))/gmiu
export class regex{
    constructor(){
        this.init()
    }

    
    createWordBoundaryRegex(list) {
        const escapedList = list.map(this.escapeRegexString);
        const regexString = `(?:${escapedList.join('|')})`;
        return new RegExp(regexString, 'gium');
    } 
  
      escapeRegexString(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      //se debe crear un nuevo objeto de regex para evitar errores https://stackoverflow.com/questions/4724701/regexp-exec-returns-null-sporadically
      tiene_match_con_gruporegex(palabra, GrupoRegex) {
          let temp_regex = new RegExp(GrupoRegex.regex)
          return temp_regex.exec(palabra) != undefined
      }
  
      buscar_match_con_gruporegex(palabra, GrupoRegex){
          let temp_regex = new RegExp(GrupoRegex.regex)
          return temp_regex.exec(palabra)
      }
      buscar_match(palabra, regex){
          let respuesta = new RegExp(regex).exec(palabra)
          if (respuesta) {
              return respuesta[0]
          }
          return null
      }
  
      init(){
            for (const o of Object.entries(GruposRegex)){
                o[1].regex = this.createWordBoundaryRegex(o[1].palabras)
            }
      }

}
    