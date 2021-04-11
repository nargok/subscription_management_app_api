import * as express from "express";
import { getRepository } from "typeorm";
import authMiddleware from "../middleware/auth.middleware";
import CreateServiceDto from "./service.dto";
import ServiceNotFoundException from "../exceptions/ServiceNotFoundException";
import Controller from "../interfaces/controller.interface";
import Service from "./service.interface";
import ServiceModel from "./service.entity";
import RequestWithUser from "../interfaces/requestWithUser.interface";

class ServicesController implements Controller {
  public path = "/services";
  public router = express.Router();
  private serviceRepository = getRepository(ServiceModel);

  contructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, authMiddleware, this.getAllServices);
    this.router.get(`${this.path}/:id`, authMiddleware, this.getServiceById);
    this.router
      .put(`${this.path}/:id`, authMiddleware, this.modifyService)
      .delete(`${this.path}/:id`, authMiddleware, this.deleteService)
      .post(this.path, authMiddleware, this.createService);
  }

  private getAllServices = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const games = await this.serviceRepository.find();
    response.send(games);
  };

  private getServiceById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const service = await this.serviceRepository.findOne(id);
    if (service) {
      response.send(service);
    } else {
      next(new ServiceNotFoundException(id));
    }
  };

  private createService = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const serviceData: CreateServiceDto = request.body;
    const newService = this.serviceRepository.create({
      ...serviceData,
      author: request.user,
    });
    await this.serviceRepository.save(newService);
    newService.author.password = "";
    response.send(newService);
    return;
  };

  private modifyService = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const serviceData: Service = request.body;
    await this.serviceRepository.update(id, serviceData);
    const updatedService = await this.serviceRepository.findOne(id);
    if (updatedService) {
      response.send(updatedService);
    } else {
      next(new ServiceNotFoundException(id));
    }
  };

  private deleteGame = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const deleteResponse = await this.serviceRepository.delete(id);
    if (deleteResponse.affected === 1) {
      response.sendStatus(200);
    } else {
      next(new ServiceNotFoundException(id));
    }
  };
}

export default ServicesController;
