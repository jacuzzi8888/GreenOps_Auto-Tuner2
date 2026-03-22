import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`GreenOps Auto-Tuner MCP Server is actively listening on port ${PORT}`);
    console.log(`- Connect your MCP Client to http://localhost:${PORT}/sse`);
});
