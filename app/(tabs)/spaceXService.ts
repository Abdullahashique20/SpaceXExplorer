import api from "../axiosClient"

export const getListData = async () => {
    let resposnse = await api.get("/v5/launches")
    return resposnse
}

export const getListDetails = async (id: string) => {
    let response = await api.get(`https://api.spacexdata.com/v4/launchpads/${id}`)
    return response
}