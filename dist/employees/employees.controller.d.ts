import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    findAll(): Promise<{
        id: string;
        uuid: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        uuid: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }>;
    create(body: CreateEmployeeDto): Promise<{
        id: string;
        uuid: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }>;
    updateWithParam(id: string, body: any): Promise<{
        id: string;
        uuid: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }>;
    update(body: UpdateEmployeeDto): Promise<{
        id: string;
        uuid: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        dateJoined: Date;
    }>;
}
