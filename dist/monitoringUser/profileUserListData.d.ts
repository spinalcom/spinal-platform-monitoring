declare const data: {
    id: string;
    name: string;
    graphId: string;
    appList: {
        data: {
            name: string;
            id: string;
        };
        role: {
            id: string;
            name: string;
        }[];
    }[];
}[];
export default data;
