var graph_constants = rootAppRequire('common-node/graph-constants');
const {DELETE_UNUSED_RECORDS}=graph_constants;


module.exports = function (graph_db) {

    class VersionRepository {

  static  deleteAll() {

        // delete rsds  MATCH (n_rsd:L_RSD) DETACH DELETE n_rsd

        var delete_all_sql = 'MATCH (n) DETACH DELETE n'
        var params = {};
            return graph_db.sqlParams(delete_all_sql, params);
    }
    
        static entireDb(){
            var sql = ` MATCH (a) RETURN a`;
            var params = {};
            return graph_db.sqlParams(sql, params);
        }

        /*
         VersionRepository.updateDbVersion()
         .then( (new_db_version)=>clog('new_version==', new_db_version));
         */

        static saveAuthors(db_version, all_links) {
            var sql = ` MERGE ( n_authors_list:L_AUTHOR_LIST  
                                 { all_links:{all_links}, db_version:{db_version}  }  ) `;
            var params = {all_links, db_version};
            return graph_db.sqlParams(sql, params);
        }

        static getAuthors() {
            var sql = ` MATCH (n_version:L_VERSION) 
                         WITH n_version.current_version as v_db_version
                          MATCH ( n_authors_list:L_AUTHOR_LIST)
                         WHERE n_authors_list.db_version=v_db_version
                         RETURN v_db_version, n_authors_list.all_links `;
            var params = {};
            return graph_db.sqlParams(sql, params);
        }


        static saveBooks(db_version, all_links) {
            var sql = ` MERGE ( n_books_list:L_BOOK_LIST  
                                 { all_links:{all_links}, db_version:{db_version}  }  ) `;
            var params = {all_links, db_version};
            return graph_db.sqlParams(sql, params);
        }

        static getBooks() {
            var sql = ` MATCH (n_version:L_VERSION) 
                         WITH n_version.current_version as v_db_version
                          MATCH ( n_books_list:L_BOOK_LIST)
                         WHERE n_books_list.db_version=v_db_version
                         RETURN v_db_version, n_books_list.all_links `;
            var params = {};
            return graph_db.sqlParams(sql, params);
        }


        static saveDefaultAuthors(db_version, default_code) {
            var sql = ` CREATE ( n_default:L_DEFAULT  
                                 { default_code:{default_code}, db_version:{db_version}  }  ) `;
            var params = {default_code, db_version};
            return graph_db.sqlParams(sql, params);
        }



// 
        static getDefaultAuthors() {
            var sql = ` MATCH (n_version:L_VERSION) 
                         WITH n_version.current_version as v_db_version
                          MATCH (n_default:L_DEFAULT )
                         WHERE n_default.db_version=v_db_version
                         RETURN v_db_version, n_default.default_code `;
            var params = {};
            return graph_db.sqlParams(sql, params);
        }


        static saveQuality(db_version, quality_code) {
            var sql = ` CREATE ( n_quality:L_QUALITY  
                                 { quality_code:{quality_code}, db_version:{db_version}  }  ) `;
            var params = {quality_code, db_version};
            return graph_db.sqlParams(sql, params);
        }

        static getQuality() {
            var sql = ` MATCH (n_version:L_VERSION) 
                         WITH n_version.current_version as v_db_version
                          MATCH (n_quality:L_QUALITY)
                         WHERE n_quality.db_version=v_db_version
                         RETURN n_quality.quality_code `;
            var params = {};
            return graph_db.sqlParams(sql, params);
        }

        static updateDbVersion() {
            var update_sql = ` // VersionRepository.updateDbVersion.update           
                        MATCH (n_version:L_VERSION) 
                         WITH n_version.current_version+1 as v_new_db_version
                        MERGE (n_version:L_VERSION)
                 ON MATCH SET n_version.current_version = v_new_db_version ,
                              n_version.update_step = 0 `;
            return graph_db.sqlParams(update_sql, {});
        }


        static updateDbVersion_d_3(next_db_version) {
            var update_sql = ` // VersionRepository.updateDbVersion.update           
                        MATCH  (n_version:L_VERSION)
                        SET n_version.current_version = {next_db_version} `;
            var params = {next_db_version};
            return graph_db.sqlParams(update_sql, params);
        }


        static currentDbVersion() {
            var current_sql = ` // VersionRepository.currentDbVersion        
                                MATCH (n_version:L_VERSION )
                               RETURN * `;
            return graph_db.sqlParams(current_sql, {})
                .then((current_version_record)=> {
                        if (typeof current_version_record.records[0] === 'undefined') {
                            return 0;
                        } else {
                            return current_version_record.records[0]._fields[0].properties.current_version;
                        }
                    }
                ).catch(function (e) {
                    return 0;            ///  current_version_record is NOTHING, start at 0
                })
        }

        static createDbVersion1() {
            var create_sql = ` // VersionRepository.createDbVersion        
                        MERGE (n_version:L_VERSION)
                ON CREATE SET n_version.current_version = 0               `;
            return graph_db.sqlParams(create_sql, {});
        }


        /*
         VersionRepository.deleteUnused(123)
         .then( (db_version_counts)=>clog('db_version_counts==', db_version_counts));
         */
        static deleteUnused_d_4(next_db_version, limit_records = DELETE_UNUSED_RECORDS) {
            var unused_sql = ` // VersionRepository.deleteUnused.unused_sql        
                         MATCH (n_nodes) 
                         WHERE (NOT n_nodes:L_VERSION)
                           AND n_nodes.db_version<{next_db_version}
                          WITH n_nodes LIMIT ${limit_records}
                 DETACH DELETE n_nodes  `;

            var params = {next_db_version};
            return graph_db.sqlParams(unused_sql, params);

        }

        static deleteFail_d_5(next_db_version, limit_records = DELETE_UNUSED_RECORDS) {
            //misc_helper.deleteCachedData();

            var unused_sql = ` // VersionRepository.deleteUnused.unused_sql        
                         MATCH (n_nodes) 
                         WHERE (NOT n_nodes:L_VERSION)
                           AND n_nodes.db_version={next_db_version}
                          WITH n_nodes LIMIT ${limit_records}
                 DETACH DELETE n_nodes  `;

            var params = {next_db_version};
            return graph_db.sqlParams(unused_sql, params);

        }

    }
    return VersionRepository;
}
