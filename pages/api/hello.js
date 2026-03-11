
export default function handler(req, res) {
    res.status(200).json({ text: 'Hello ' + (req.query.who ? req.query.who : 'World') + '!' });
}