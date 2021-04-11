import HttpException from "./HttpException";

class ServiceNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Service with id ${id} not found`);
  }
}

export default ServiceNotFoundException;
