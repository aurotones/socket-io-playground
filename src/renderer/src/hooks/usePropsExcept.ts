export default function usePropsExcept<T extends object>(props: T, filterKeys: Array<keyof T>){
    return (Object.keys(props) as Array<keyof T>)
        .filter((key) => {
            return !filterKeys.includes(key);
        })
        .reduce((prev, curr) => ({ ...prev, [curr]: props[curr] }), {});
}
