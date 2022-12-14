import { BaseService, ErrorWrapper, ResponseWrapper } from "./base";
export class SmartContractsService extends BaseService {
    static getUnity() {
        return '/smartconstract'
    }

    static async GetCommonSmartContracts() {
        try {
            const response = await this.request({ auth: true }).get(`${this.getUnity()}/api?type=common`)
            console.log(response)
            // const data = {
            //     content: response.data.data,
            //     headers: response.headers['']
            // }
            return new ResponseWrapper(response, response.data)
        } catch (error) {
            const message = error.response.data ? error.response.data.error : error.response.statusText
            throw new ErrorWrapper(error, message)
        }
    }

    static async GetPrivateSmartContracts() {
        try {
            const response = await this.request({ auth: true }).get(`${this.getUnity()}/api?type=private`)
            // const data = {
            //     content: response.data.data,
            //     headers: response.headers['']
            // }
            return new ResponseWrapper(response, response.data)
        } catch (error) {
            const message = error.response.data ? error.response.data.error : error.response.statusText
            throw new ErrorWrapper(error, message)
        }
    }
    static async GetPendingSmartContracts() {
        try {
            const response = await this.request({ auth: true }).get(`${this.getUnity()}/api?type=pending`)
            // const data = {
            //     content: response.data.data,
            //     headers: response.headers['']
            // }
            return new ResponseWrapper(response, response.data)
        } catch (error) {
            const message = error.response.data ? error.response.data.error : error.response.statusText
            throw new ErrorWrapper(error, message)
        }
    }

    /*---------Create New Smartcontract--------- */
    static async CreateSmartContracts(id, sc_name, type, content) {
        try {
            const paraData = {
                "id": id,
                "name": sc_name,
                //"date_modified": date_modified,
                "type": type,
                "content": content,
                "aid":"1"
            }
            const response = await this.request({ auth: true }).post(`${this.getUnity()}/api/`, paraData)
            // const data = {
            //     content: response.data.data,
            //     headers: response.headers['']
            // }
            return new ResponseWrapper(response, response.data)
        } catch (error) {
            const message = error.response.data ? error.response.data.error : error.response.statusText
            throw new ErrorWrapper(error, message)
        }
    }
    /*---------Update Smartcontract--------- */
    static async UpdateSmartContracts(id, sc_name, code) {
        const smartContractById = await this.request({ auth: true }).get(`${this.getUnity()}/scbyid?id=${id}`)
        try {
            const paraData = {
                "id": id,
                "name": sc_name,
                //"date_modified": smartContractById.data.date_modified,
                "content": code,
                "type": smartContractById.data.type,
                "aid":1
            }
            console.log(paraData)
            const response = await this.request({ auth: true }).put(`${this.getUnity()}/api/`, paraData)
            // const data = {
            //     content: response.data.data,
            //     headers: response.headers['']
            // }
            return new ResponseWrapper(response, response.data)
        } catch (error) {
            const message = error.response.data ? error.response.data.error : error.response.statusText
            throw new ErrorWrapper(error, message)
        }
    }
      /*---------Acccept Pendind Smartcontract--------- */
      static async AcceptPendingSmartContracts(id, sc_name, code) {
        try {
            const paraData = {
                "id": id,
                "name": sc_name,
                //"date_modified": smartContractById.data.date_modified,
                "content": code,
                "type": "common",
                "aid":1
            }
            console.log(paraData)
            const response = await this.request({ auth: true }).put(`${this.getUnity()}/api/`, paraData)
            // const data = {
            //     content: response.data.data,
            //     headers: response.headers['']
            // }
            return new ResponseWrapper(response, response.data)
        } catch (error) {
            const message = error.response.data ? error.response.data.error : error.response.statusText
            throw new ErrorWrapper(error, message)
        }
    }
    /*---------Delete Smartcontract--------- */
    static async DeleteSmartContracts(id) {
        try {
            console.log(id)
            const response = await this.request({ auth: true }).delete(`${this.getUnity()}/api/?id=${id}`)
            // const data = {
            //     content: response.data.data,
            //     headers: response.headers['']
            // }
            console.log(response)
            return new ResponseWrapper(response, response.data)
        } catch (error) {
            const message = error.response.data ? error.response.data.error : error.response.statusText
            throw new ErrorWrapper(error, message)
        }
    }

}