dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

prod_b:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

down:
	docker-compose down