import cmd from "node-cmd";

let download = modules => {
    if(modules.length == 0) return;
    let str = "";
    for(module of modules)
        str += module + " ";
    cmd.run("npm install --save " + str);
    console.log("install " + str);
};

const have = element => ({
    in: array => {
        for(let el in array)
            if(el == element) return true;
        return false;
    }
});



const parse = (sieve,converter,separator) => str =>
    str.split(separator).filter(sieve).map(converter);


const filterImports = searchKeys => str => {
    let res = false;
    for(let word of searchKeys)
        res = str.indexOf(word) != -1 || res;
    return res;
};

const getModule = searchKeys => (string = "") => {
    let index = -1;
    searchKeys.forEach(word => index = index == -1 ? string.indexOf(word) : index);
    string = string.substr(index == -1 ? 0 : index);
    let value = getValueOfImport(string);
    if( !value || value[0] == '.') return;
    return value;
};
let searchKeys = ["import","require"];
const importsIn = parse(filterImports(searchKeys), getModule(searchKeys), "\n");

const getFirstAndLast = (str,target) => [str.indexOf(target), str.lastIndexOf(target)];
const getValueOfImport = str => {
    let [first , last] = getFirstAndLast(str,"'");
    let [anotherFirst, anotherLast] = getFirstAndLast(str, '"');
    if((first == -1 || last == -1) || ((anotherFirst != -1 && anotherLast != -1) && (first > anotherFirst)))
        [first,last] = [anotherFirst,anotherLast];
    return str.substring(first + 1, last);
};

export default file =>
    new Promise(resolve =>
        cmd.get(
            "npm ls",
            data => resolve(data.split("\n")
                .filter(str => str[0] == "+" || str[0] == "`")
                .map(str => str.substring(4,str.indexOf("@")))
            )
        )
    ).then(modules =>
        download(importsIn(file).filter(el =>
                !have(el).in(modules)
        ))
    );