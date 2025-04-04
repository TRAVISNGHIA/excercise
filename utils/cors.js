import Cors from "cors";

const cors = Cors({
    methods: ["GET", "POST","DELETE","PUT", "OPTIONS"],
    origin: "*",
});

export function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default cors;
