# DispatchMesh

### Project Structure
```
    DispatchMesh/
    ├── docker-compose.yml              # Orchestrates all 4 containers
    ├── .env                            # Local environment variables (JWT secret, DB urls)
    ├── .env.example                    # Environment variable template
    ├── .gitignore                      # Ignores node_modules, .env, venv, Agents.md, etc.
    │
    ├── services/web-gateway/           # TypeScript/Node.js Service
    │   ├── Dockerfile                  # Multi-stage Node 20 Alpine build
    │   ├── package.json                # @dispatchmesh/web-gateway (includes jsonwebtoken)
    │   ├── tsconfig.json               # Strict, ES2022, NodeNext
    │   └── src/
    │       ├── server.ts               # Express + WebSocket entry point
    │       ├── types/contracts.ts      # LocationUpdate, MatchRequest, TripState interfaces
    │       ├── db/connection.ts        # PostgreSQL Pool export
    │       ├── services/
    │       │   ├── dispatch-engine.ts  # HTTP client to Python matching engine
    │       │   └── broker.ts           # Redis Pub/Sub channel subscriptions
    │       └── handlers/
    │           └── websocket-handler.ts  # WebSocket message routing & JWT auth
    │
    └── services/matching-engine/       # Python Microservice
        ├── Dockerfile                  # Python 3.12-slim
        ├── requirements.txt            # FastAPI, uvicorn, redis, psycopg2, pydantic
        └── app/
            ├── main.py                 # FastAPI entry point
            ├── models/schemas.py       # Pydantic models mirroring TS contracts
            ├── services/
            │   ├── dispatch_engine.py  # Core matching logic, PostGIS queries, event enrichment
            │   └── broker.py           # Redis publisher for microservice events
            └── db/connection.py        # Postgres connection loader
```

### AI Integration
- Dynamic Surge Pricing Predictor: A small regression model or microservice that adjusts fare prices based on simulated driver supply and rider demand in a specific geographical zone.
- ETA Estimation Model: An internal service that uses historical trip duration data to predict delivery or pickup times more accurately than a simple distance calculation.