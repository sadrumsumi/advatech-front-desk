import { password } from "../utils";
import {
  CustomerEntity,
  DeviceEntity,
  CityEntity,
  OfficeEntity,
  RoleEntity,
  TaskEntity,
  UserEntity,
  UserTaskEntity,
} from "../entities";
import { Equal } from "typeorm";
import { AppDataSource } from "../../ormconfig";

export class StaffModel {
  //
  static monthlyReport(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(body);

        // Give feedback
        resolve({ status: true, message: "", data: {} });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Office Module
  static office(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await Promise.all([
          await OfficeEntity.find({ where: {} }),
          await CityEntity.find({ where: {} }),
        ]).then(([office, cities]) => {
          resolve({
            status: true,
            message: "Success",
            data: {
              cities,
              office: office.map((e) => {
                return {
                  id: e.id,
                  fullName: e.head,
                  phoneNumber: e.phoneNumber,
                  locationAddress: e.locationAddress,
                };
              }),
            },
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static addOffice(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if data exist
        const checkOffice = await OfficeEntity.findOneBy({
          phoneNumber: body["phoneNumber"],
        });

        if (checkOffice == null) {
          const office = new OfficeEntity({
            head: body["head"],
            phoneNumber: body["phoneNumber"],
            city: await CityEntity.findOneBy({
              id: body["cityId"],
            }),
            locationAddress: body["locationAddress"],
          });
          // Create new office
          await office.save();
          // Give feedback
          resolve({
            status: true,
            message: "Data saved successfull.",
            data: {},
          });
        } else {
          // Give feedback
          resolve({
            status: false,
            message: "Office details exist.",
            data: null,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  static updateOffice(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if data exist
        let checkOffice: OfficeEntity;

        if (body["phoneNumber"] != body["oldPhoneNumber"]) {
          checkOffice = await OfficeEntity.findOneBy({
            phoneNumber: body["phoneNumber"],
          });
        }

        if (checkOffice == null || checkOffice == undefined) {
          await OfficeEntity.update(
            { phoneNumber: body["phoneNumber"] },
            {
              phoneNumber: body["phoneNumber"],
              locationAddress: body["locationAddress"],
            }
          );
          // Give feedback
          resolve({
            status: true,
            message: "Office details updated successfull.",
            data: {},
          });
        } else {
          // Give feedback
          resolve({
            status: false,
            message: "Office details exist.",
            data: null,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // User Module
  static users(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await Promise.all([
          // Fetch cities
          await CityEntity.find({ where: {} }),
          // Fetch office
          await OfficeEntity.find({ where: {} }),
          // Fetch users
          await UserEntity.find({ where: {}, relations: ["role", "office"] }),
        ]).then(([cities, office, users]) => {
          // Give feedback
          resolve({
            status: true,
            message: "Success",
            data: {
              cities,
              office: office.map((e) => {
                return {
                  id: e.id,
                  name: `Head: ${e.head}, Location: ${e.locationAddress}`,
                };
              }),
              users: users.map((e) => {
                return {
                  role: e.role.type,
                  workingOffice: e.office.locationAddress,
                  fullName: `${e.firstName} ${e.lastName}`,
                  phoneNumber: e.phoneNumber,
                };
              }),
            },
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //
  static addUser(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if user exist
        const checkUser = await UserEntity.findOneBy({
          phoneNumber: body["phoneNumber"],
        });

        // Hash password
        const hashedText = await password.hash({
          password: body["phoneNumber"],
        });

        if (checkUser == null) {
          const user = new UserEntity({
            firstName: body["firstName"],
            lastName: body["lastName"],
            phoneNumber: body["phoneNumber"],
            password: hashedText,
            role: await RoleEntity.findOneBy({ type: body["role"] }),
            office: await OfficeEntity.findOneBy({ id: body["officeId"] }),
          });
          await user.save();
          // Give feedback
          resolve({
            status: true,
            message: "Account created successfull.",
            data: {},
          });
        } else {
          resolve({
            status: true,
            message: "Data belong's to someone else.",
            data: null,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  //
  static updateUser(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // Check user details
        let checkUser: UserEntity;
        if (body["phoneNumber"] != body["oldPhoneNumber"]) {
          checkUser = await UserEntity.findOneBy({
            phoneNumber: body["phoneNumber"],
          });
        }

        if (checkUser == null) {
          // Hash password
          const hashedText = await password.hash({
            password: body["password"],
          });
          // Fetch user
          let user = await UserEntity.findOneBy({ id: body["updateUser"] });
          //
          user.firstName = body["firstName"];
          user.lastName = body["lastName"];
          user.phoneNumber = body["password"];
          user.password =
            body["password"] == ".e." ? user.password : hashedText;
          user.role = await RoleEntity.findOneBy({ type: body["role"] });
          user.office = await OfficeEntity.findOneBy({ id: body["officeId"] });
          // Upate user details
          await user.save();
          // Give feedback
          resolve({
            status: true,
            message: "User details is up to date.",
            data: {},
          });
        } else {
          resolve({
            status: true,
            message: "Data belong's to someone else.",
            data: null,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // Customer Module
  static customers(officeId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await Promise.all([
          // Fetch cities
          await CityEntity.find({ where: {} }),
          //
          await CustomerEntity.find({
            where: officeId ? { office: Equal(officeId) } : {},
          }),
          //
          await OfficeEntity.find({
            where: officeId ? { id: officeId } : {},
            relations: ["city", "customer", "device", "device.task"],
          }),
        ]).then(([cities, customers, offices]) => {
          // Give feedback
          resolve({
            status: true,
            message: "Success",
            data: {
              cities,
              customers,
              offices: offices.map((e) => {
                return {
                  id: e.id,
                  name: `Head: ${e.head}, Office location: ${e.city.city}`,
                };
              }),
            },
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static addCustomer(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const customer = new CustomerEntity({
          tradeName: body["tradeName"],
          office: await OfficeEntity.findOneBy({ id: body["officeId"] }),
          companyName: body["companyName"],
          phoneNumber: body["phoneNumber"],
        });
        // Create new customer
        await customer.save();
        // Give feedback
        resolve({
          status: true,
          messasge: "Customer added successfull.",
          data: {},
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static updateCustomer(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await CustomerEntity.update(body["customerId"], {
          tradeName: body["tradeName"],
          office: await OfficeEntity.findOneBy({ id: body["officeId"] }),
          companyName: body["companyName"],
          phoneNumber: body["phoneNumber"],
        });
        // Give feedback
        resolve({
          status: true,
          message: "Customer details is up to date.",
          data: {},
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Device Module
  static devices(officeId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        //
        await Promise.all([
          await CityEntity.find(),
          await TaskEntity.find({
            relations: ["device"],
            where: { status: "not collected" },
          }),
          await OfficeEntity.find({
            where: officeId ? { id: officeId } : {},
            relations: ["city", "customer", "device", "device.task"],
          }),
        ]).then(([cities, queries, getOffices]) => {
          //
          let officeData: any[] = [];
          let offices: any[] = [];
          for (let o = 0; o < getOffices.length; o++) {
            let devices: any[] = [];
            let office = getOffices[o];
            for (let d = 0; d < office.device.length; d++) {
              let device = office.device[d];

              devices.push({
                id: device.id,
                status: device.status,
                reported: device.task.length,
                serialNumber: device.serialNumber,
                simCardNumber: device.simCardNumber,
                locationAddress: device.locationAddress,
              });
            }
            // List of office
            offices.push({
              details: `Head: ${office.head}, Tel: ${office.phoneNumber}, Office location: ${office.locationAddress}, ${office.city.city}`,
              devices,
            });
          }

          //
          let customers: any[] = [];
          for (let o = 0; o < getOffices.length; o++) {
            let office = getOffices[o];

            officeData.push({
              id: office.id,
              name: `Head: ${office.head}, Office location: ${office.city.city}`,
            });

            for (let c = 0; c < office.customer.length; c++) {
              let customer = office.customer[c];
              customers.push({
                id: customer.id,
                customerName: `Trade name: ${customer.tradeName}, Company name: ${customer.companyName}`,
              });
            }
          }

          // Give feedback
          resolve({
            status: true,
            message: "Success",
            data: {
              cities,
              offices,
              customers,
              notifiy: queries.length,
              notifications: queries.map((e) => {
                return {
                  deviceId: e.device.id,
                  date: e.createdAt,
                  query: e.reportedIssue,
                };
              }),
              office: officeData,
            },
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static addDevice(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const checkDevice = await DeviceEntity.findOne({
          where: [
            { serialNumber: body["serialNumber"] },
            { simCardNumber: body["simCardNumber"] },
          ],
        });

        if (checkDevice == null) {
          const device = new DeviceEntity({
            simCardNumber: body["simCardNumber"],
            serialNumber: body["serialNumber"],
            locationAddress: body["locationAddress"],
            customer: await CustomerEntity.findOneBy({
              id: body["customerId"],
            }),
            office: await OfficeEntity.findOneBy({ id: body["officeId"] }),
          });
          // Add device
          await device.save();
          // Give feedback
          resolve({
            status: true,
            message: "Device added successfull.",
            data: {},
          });
        } else {
          // Give feedback
          resolve({
            status: false,
            message: "Device exist, you can update.",
            data: null,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  static updateDevice(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let device: DeviceEntity;
        if (
          body["serialNumber"] != body["oldSerialNumber"] ||
          body["simCardNumber"] != body["oldSimCardNumber"]
        ) {
          device = await DeviceEntity.findOne({
            where: [
              {
                serialNumber: body["serialNumber"],
              },
              {
                simCardNumber: body["simCardNumber"],
              },
            ],
          });
        }

        if (device == null || device == undefined) {
          await DeviceEntity.update(body["deviceId"], {
            simCardNumber: body["simCardNumber"],
            serialNumber: body["serialNumber"],
            locationAddress: body["locationAddress"],
            customer: await CustomerEntity.findOneBy({
              id: body["customerId"],
            }),
            office: await OfficeEntity.findOneBy({ id: body["officeId"] }),
          });
          // Give feedback
          resolve({
            status: true,
            message: "Device details is up to date.",
            data: {},
          });
        } else {
          // Give feedback
          resolve({
            status: false,
            message: "Device details exist.",
            data: null,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  static reportedIssue2(userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await UserEntity.findOne({
          relations: ["task", "task.user", "task.device"],
          where: { id: userId },
        });

        const reported = user.task.map((e) => {
          return {
            status: e.status.toLowerCase(),
            reporterName: e.reporterName,
            reporterPhoneNumber: e.reporterPhoneNumber,
            reportedIssue: e.reportedIssue,
            reportedDate: e.reportedDate,
            timeIn: e.timeIn,
            timeOut: e.timeOut,
            deviceSerialNumber: e.device.serialNumber,
            deviceSimeCard: e.device.simCardNumber,
            deviceLocationAddress: e.device.locationAddress,
            assignedTo: `${e.user.firstName + " " + e.user.lastName}, ${
              e.user.phoneNumber
            }`,
          };
        });

        resolve({ status: true, message: "Success", data: { reported } });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Task Module
  static reportedIssue(params: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let task: any[];
        let device: DeviceEntity;
        if (params["deviceId"]) {
          await Promise.all([
            (device = await DeviceEntity.findOne({
              relations: ["task", "task.user", "office"],
              where: { id: params["deviceId"] },
            })),
            await AppDataSource.getRepository(UserEntity)
              .createQueryBuilder("user")
              .leftJoin("user.role", "role")
              .leftJoin("user.office", "office")
              .where("role.type = 'technician'")
              .andWhere("office.id = :officeId", {
                officeId: device.office.id,
              })
              .getMany(),
          ]).then(([device, technicians]) => {
            task =
              device == null
                ? []
                : device.task.map((e) => {
                    return {
                      id: e.id,
                      status: e.status.toLowerCase(),
                      reporterName: e.reporterName,
                      reporterPhoneNumber: e.reporterPhoneNumber,
                      reportedIssue: e.reportedIssue,
                      reportedDate: e.reportedDate,
                      timeIn: e.timeIn,
                      timeOut: e.timeOut,
                      assignedToId: e.user.id,
                      deviceSerialNumber: device.serialNumber,
                      deviceSimeCard: device.simCardNumber,
                      deviceLocationAddress: device.locationAddress,
                      assignedTo: `${
                        e.user.firstName + " " + e.user.lastName
                      }, ${e.user.phoneNumber}`,
                    };
                  });

            // Give feedback
            resolve({
              status: true,
              message: "Success",
              data: {
                reported: task,
                technicians: technicians.map((e) => {
                  return {
                    id: e.id,
                    name: `Name: ${e.firstName + " " + e.lastName}, Phone: ${
                      e.phoneNumber
                    }`,
                  };
                }),
              },
            });
          });
        } else {
          const getTask = await TaskEntity.find({
            relations: ["userTask", "userTask.user", "device"],
          });

          task = getTask.map((e) => {
            return {
              id: e.id,
              status: e.status.toLowerCase(),
              reporterName: e.reporterName,
              reporterPhoneNumber: e.reporterPhoneNumber,
              reportedIssue: e.reportedIssue,
              reportedDate: e.reportedDate,
              timeIn: e.timeIn,
              timeOut: e.timeOut,
              deviceSerialNumber: e.device.serialNumber,
              deviceSimeCard: e.device.simCardNumber,
              deviceLocationAddress: e.device.locationAddress,
              assignedToId: e.user.id,
              assignedTo: `${e.user.firstName + " " + e.user.lastName} ${
                e.user.phoneNumber
              }`,
            };
          });

          // Give feedback
          resolve({
            status: true,
            message: "Success",
            data: { reported: task },
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  static reportIssue(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await Promise.all([
          await UserEntity.findOne({
            relations: ["office"],
            where: { id: body["assignedTo"] },
          }),
          await DeviceEntity.findOneBy({ id: body["deviceId"] }),
        ]).then(async ([assignedTo, device]) => {
          if (body["reportedIssueId"] == "") {
            // Get device

            device.status = "not collected";
            await device.save();

            const task = new TaskEntity({
              reporterName: body["reporterName"],
              reporterPhoneNumber: body["phoneNumber"],
              reportedIssue: body["reportedIssue"],
              reportedDate: body["reportedDate"],
              timeIn: body["timeIn"],
              timeOut: body["timeOut"],
              office: assignedTo.office,
              user: assignedTo,
              device,
            });
            // Create task
            await task.save();

            // Asign task
            const userTask = new UserTaskEntity({ user: assignedTo, task });
            await userTask.save();
            // Give feedback
            resolve({
              status: true,
              message: "Task created successfull.",
              data: {},
            });
          } else {
            device.status = body["reportStatus"].toLowerCase();
            await device.save();

            // update status
            await TaskEntity.update(body["reportedIssueId"], {
              reporterName: body["reporterName"],
              reporterPhoneNumber: body["phoneNumber"],
              reportedIssue: body["reportedIssue"],
              reportedDate: body["reportedDate"],
              status: body["reportStatus"].toLowerCase(),
              timeIn: body["timeIn"],
              timeOut: body["timeOut"],
              office: assignedTo.office,
              user: assignedTo,
              device,
            });
            // Give feedback
            resolve({
              status: true,
              message: "Task is up to date.",
              data: {},
            });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateReportedIssue(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await TaskEntity.update(body["taskId"], {
          reporterName: body["reporterName"],
          reporterPhoneNumber: body["reporterPhoneNumber"],
          reportedIssue: body["reportedIssue"],
          reportedDate: body["reportedDate"],
          timeIn: body["timeIn"],
          timeOut: body["timeOut"],
          office: await OfficeEntity.findOneBy({ id: body["officeId"] }),
          device: await DeviceEntity.findOneBy({ id: body["deviceId"] }),
        });
        // Give feedback
        resolve({ status: true, message: "", data: {} });
      } catch (error) {
        reject(error);
      }
    });
  }
}
