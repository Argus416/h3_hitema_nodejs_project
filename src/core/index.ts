import app from "../server";
import connectDatabase from "../database";

const port = 3001;

const RUN_APP = () =>{
    connectDatabase()

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default RUN_APP
