import {Injector} from "@sailplane/injector";
import {Seconds} from "temporal-types";
import {MillisecondsInSecond, SecondsInMinute} from "temporal-constants";
import * as createError from "http-errors";
import {PackageRepository} from "./package-repository";
import {
  AppUser,
  Package,
  PackageRequest
} from "./model";

/**
 * Application logic.
 * Agnostic to how it is called and where data is stored.
 */
export class PackageService {
  constructor(private packageRepo: PackageRepository) {
  }

  async create(request: PackageRequest, user: AppUser): Promise<Package> {
    if (!request.name || !request.contentType || !request.fileName) {
      throw new createError.BadGateway('Request validation error');
    }

    const epochTime = Math.floor(Date.now() / MillisecondsInSecond) as Seconds;
    const packageItem: Package = {
      ...request,
      userId: user.id,
      userName: user.name,
      createdOn: new Date().toISOString(),
      ttl: epochTime + SecondsInMinute
    };

    return this.packageRepo.create(packageItem);
  }
}

Injector.register(PackageService, [PackageRepository]);
