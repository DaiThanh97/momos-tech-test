bootstrap:
	@echo "==============================Bootstrapping dependencies==============================" 
	docker-compose up -d mysql redis

	@echo "==============================Waiting for bootstrapping...=============================="
	sleep 5

	@echo "==============================Bootstrapping backend=============================="
	cd ./media-scraper-api && yarn && cp .env.example .env && yarn start:dev & \

	@echo "==============================Waiting for backend to be ready...=============================="
	sleep 15

	@echo "==============================Bootstrapping frontend=============================="
	cd ./media-scraper-ui && yarn && cp .env.example .env && yarn start

	@echo "==============================Application is up and running=============================="

	@echo "Application is up and running. Now you can access application through http://localhost:3000", docs: http://localhost:4000/api/v1/docs

cleanup:
	@echo "==============================Shutting down application==============================" 
	docker-compose down -v

	@echo "==============================Processing...=============================="
	sleep 5

	@echo "Shut down complete"