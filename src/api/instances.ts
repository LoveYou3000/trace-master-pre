import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data?: Array<any>;
};

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

/** 获取实例管理-实例列表 */
export const getInstanceList = (data?: object) => {
  return http.request<ResultTable>("post", "/api/instances", { data });
};

/** 实例管理-修改实例状态 */
export const updateInstanceStatus = (data?: object) => {
  return http.request<Result>("put", "/api/instances", { data });
};
