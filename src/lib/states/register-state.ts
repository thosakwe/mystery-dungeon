export default function registerState(name:string) {
    return target => {
        target.prototype.stateName = name;
    };
}