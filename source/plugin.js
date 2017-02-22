
const downloadMissingModules = (importsIn,have,download) => (modules,files) =>
    files.forEach(file =>
        importsIn(file).forEach(el => {
            if(!(have(el).in(modules)))
                download(el);
        })
    );

const have = element => ({
    in: array => {
        for(let el in array)
            if(el == element) return true;
        return false;
    }
});

const parse = (sieve,converter,separator) => str =>
    str.split(separator).filter(sieve).map(converter);

const getModule = (getValueOfImport) => (string = "") => {
    let value = getValueOfImport(string);
    if( !value || value[0] == '.') return;
    return value;
};

const filterImports = searchKeys => str => {
    for(let word of searchKeys) 
        return str.indexOf(word) != -1;
};
const getValueOfImport = str => 
    str.substring((str.indexOf('"')     || str.indexOf("'")   ) + 1,
                   str.lastIndexOf('"') || str.lastIndexOf("'")
    );

const trade = (obj,key,value) => {
    let oldValue = obj[key];
    obj[key] = value;
    return oldValue;
};

const filterNotChanged = oldVersions => ({ name, hash }) =>
    hash !== trade(oldVersions,name,hash);



const filterAndDownload = (sieve, download) => oldVersions => files =>
    download(files
        .filter(sieve(oldVersions))
        .map(file => file.source)
    );

let plugin =
    filterAndDownload(
        filterNotChanged,
        downloadMissingModules(
            parse(
                filterImports((["import","require"])),
                getModule(getValueOfImport),
                "\n"
            ),
            have
            /*,TODO: download*/
        )
    );

export default plugin;