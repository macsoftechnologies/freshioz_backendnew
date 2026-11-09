import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    findAll(req: any): Promise<{
        assignedWarehouse: any;
        assignedWarehouseName: any;
        assignedLocationName: any;
        id: string;
        updatedAt: Date;
        name: string;
        uuid: string;
        status: string;
        createdAt: Date;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }[]>;
    findOne(id: string): Promise<{
        assignedWarehouse: {
            id: string;
            name: string;
            uuid: string;
            code: string;
        };
        assignedWarehouseName: string;
        assignedLocationName: string;
        id: string;
        updatedAt: Date;
        name: string;
        uuid: string;
        status: string;
        createdAt: Date;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }>;
    create(body: CreateEmployeeDto): Promise<{
        id: string;
        updatedAt: Date;
        name: string;
        uuid: string;
        status: string;
        createdAt: Date;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }>;
    updateWithParam(id: string, body: any): Promise<{
        id: string;
        updatedAt: Date;
        name: string;
        uuid: string;
        status: string;
        createdAt: Date;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }>;
    update(body: UpdateEmployeeDto): Promise<{
        id: string;
        updatedAt: Date;
        name: string;
        uuid: string;
        status: string;
        createdAt: Date;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }>;
}
