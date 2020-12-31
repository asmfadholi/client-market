<template>
  <a-table :columns="columns" :data-source="data" row-key="id" :scroll="scroll" :loading="loading">
    <span slot="total" slot-scope="total">
      {{ `Rp. ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
    </span>
  </a-table>
</template>
<script>

const columns = [
  {
    dataIndex: 'id',
    key: 'id',
    title: 'ID',
    fixed: 'left'
  },
  {
    title: 'Nama',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left'
  },
  {
    title: 'Total',
    dataIndex: 'total',
    scopedSlots: { customRender: 'total' },
    key: 'total'
  }
]

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loading: false,
      columns,
      scroll: {
        x: 300
      }
    }
  }
}
</script>
