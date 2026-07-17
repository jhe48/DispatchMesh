# DispatchMesh

  ### Project Structure
```
    DispatchMesh/
    ├── docker-compose.yml          # Orchestrates all 4 containers
    ├── .env.example                # Environment variable template
    ├── .gitignore                  # Ignores node_modules, .env, venv, Agents.md, etc.
    │
    ├── services/web-gateway/       # TypeScript/Node.js Service
    │   ├── Dockerfile              # Multi-stage Node 20 Alpine build
    │   ├── package.json            # @dispatchmesh/web-gateway
    │   ├── tsconfig.json           # Strict, ES2022, NodeNext
    │   └── src/
    │       ├── server.ts           # Express + WebSocket entry point (/health endpoint)
    │       ├── types/contracts.ts  # LocationUpdate, MatchRequest, TripState interfaces
    │       ├── db/connection.ts    # PostgreSQL Pool export + empty initializeDatabase()
    │       ├── services/
    │       │   ├── dispatch-engine.ts  # DispatchEngine class (empty stubs)
    │       │   └── broker.ts          # Redis Pub/Sub (empty stubs)
    │       └── handlers/
    │           └── websocket-handler.ts  # WS message handler (empty stubs)
    │
    └── services/matching-engine/   # Python Microservice
        ├── Dockerfile              # Python 3.12-slim
        ├── requirements.txt        # FastAPI, uvicorn, redis, psycopg2, pydantic
        └── app/
            ├── main.py             # FastAPI app (/health endpoint)
            ├── models/schemas.py   # Pydantic models mirroring TS contracts
            ├── services/
            │   ├── dispatch_engine.py  # DispatchEngine class (empty stubs)
            │   └── broker.py          # Redis broker (empty stubs)
            └── db/connection.py    # DB connection loader (empty stub)
```