import dayjs from "dayjs";
import { message } from "@/utils/message";
import { usePublicHooks } from "@/views/hooks";
import { getInstanceList, updateInstanceStatus } from "@/api/instances";
import { ElMessageBox } from "element-plus";
import { reactive, ref, onMounted, toRaw } from "vue";
import type { PaginationProps } from "@pureadmin/table";

export function useRole() {
  const form = reactive({
    appId: "",
    status: undefined
  });
  const switchLoadMap = ref({});
  const dataList = ref([]);
  const loading = ref(true);
  const { switchStyle } = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "序号",
      prop: "id",
      minWidth: 60
    },
    {
      label: "系统id",
      prop: "appId",
      minWidth: 100
    },
    {
      label: "实例id",
      prop: "instanceId",
      minWidth: 150
    },
    {
      label: "宿主机ip",
      prop: "ip",
      minWidth: 140
    },
    {
      label: "状态",
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={1}
          inactive-value={0}
          active-text="已启用"
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      ),
      minWidth: 60
    },
    {
      label: "操作系统",
      prop: "system",
      minWidth: 100
    },
    {
      label: "Java版本",
      prop: "javaVersion",
      minWidth: 80
    },
    {
      label: "注册时间",
      prop: "registryTime",
      minWidth: 180,
      formatter: ({ registryTime }) =>
        dayjs(registryTime).format("YYYY-MM-DD HH:mm:ss")
    }
  ];

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 0 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.appId
      }</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        updateInstanceStatus({
          appId: row.appId,
          instanceId: row.instanceId,
          status: row.status
        }).then(({ success }) => {
          if (success) {
            setTimeout(() => {
              switchLoadMap.value[index] = Object.assign(
                {},
                switchLoadMap.value[index],
                {
                  loading: false
                }
              );
              message(`已${row.status === 0 ? "停用" : "启用"}${row.appId}`, {
                type: "success"
              });
            }, 300);
          }
        });
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getInstanceList({
      ...toRaw(form),
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    dataList.value = data.list;
    pagination.total = data.total;
    pagination.pageSize = data.pageSize;
    pagination.currentPage = data.currentPage;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange
  };
}
