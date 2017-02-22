import plugin from "./plugin"




function apply(core, options, compiler) {
    compiler.plugin('watch-run', (params) =>  {
        //------------
        //core should be called before webpack build result file
        core(moduleList,compilation.assets);
        //moduleList - list names of modules in node_modules
        //compilation.assets - files in the form
        // {
        //      name,
        //      hash,
        //      source
        // }
        //------------
    });
}



export default function (options){
    let oldVersions = {};
    let core = plugin(oldVersions);
    return {
        apply: apply.bind(this,core,options)
    }
};