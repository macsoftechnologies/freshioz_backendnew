import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    findAll(): Promise<{
        id: string;
        uuid: string;
        name: string;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        status: string;
        dateJoined: Date;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        uuid: string;
        name: string;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        status: string;
        dateJoined: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(body: CreateEmployeeDto): Promise<{
        id: string;
        uuid: string;
        name: string;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        status: string;
        dateJoined: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateWithParam(id: string, body: any): Promise<{
        id: string;
        uuid: string;
        name: string;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        status: string;
        dateJoined: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(body: UpdateEmployeeDto): Promise<{
        id: string;
        uuid: string;
        name: string;
        phone: string;
        email: string;
        roles: string[];
        assignedWarehouseId: string;
        status: string;
        dateJoined: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
