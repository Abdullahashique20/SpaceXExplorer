import api from "../axiosClient"

export const getListData = async () => {
    let resposnse = await api.get("/v5/launches")
    return resposnse
}

export const getListDetails = async (id: number) => {
    let response = await api.get(`/v4/launchpads/:${id}`)
    return response
}