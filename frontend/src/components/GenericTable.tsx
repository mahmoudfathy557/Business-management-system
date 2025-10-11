import * as React from 'react';
import { DataTable } from 'react-native-paper';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Menu, IconButton } from 'react-native-paper';

interface Column<T> {
  header: string;
  accessor: keyof T;
}


export interface MenuItem {
  title: string;
  onPress: () => void;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  menuItems?: ((item: T) => MenuItem[]);
}

const GenericTable = <T extends object>(props: Props<T>) => {
  console.log("🚀 ~ GenericTable ~ props:", props)
  const { data, columns: initialColumns, menuItems } = props;
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([5, 10, 15]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, data.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);


  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <Text style={styles.noDataText}>No data available</Text>
      ) : (
        <React.Fragment>
          <ScrollView horizontal={true}>
            <DataTable>
              <DataTable.Header>
                {initialColumns.map((column) => (
                  <DataTable.Title style={{ flex: 1, minWidth: 200 }} key={column.accessor.toString()}>{column.header}</DataTable.Title>
                ))}
                <DataTable.Title style={{ flex: 1, minWidth: 200 }}>Actions</DataTable.Title>
              </DataTable.Header>

              {data.slice(from, to).map((item, index) => (
                <TableRowWithActions
                  key={index.toString()}
                  item={item}
                  columns={initialColumns}
                  menuItems={menuItems}
                />
              ))}
            </DataTable>
          </ScrollView>
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(data.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} of ${data.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            showFastPaginationControls
            selectPageDropdownLabel={'Rows per page'}
          />
        </React.Fragment>
      )}
    </View>
  );
};

const TableRowWithActions = <T extends object>({ item, columns, menuItems }: { item: T; columns: Column<T>[]; menuItems?: ((item: T) => MenuItem[]) }) => {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const renderMenuItems = (item: any) => {
    if (!menuItems) return null;
    return menuItems(item).map((menuItem, index) => <Menu.Item key={index} onPress={() => { menuItem.onPress(); closeMenu(); }} title={menuItem.title} />)

  }

  return (
    <DataTable.Row>
      {columns.map((column) => (
        <DataTable.Cell style={{ flex: 1, minWidth: 200 }} key={column.accessor.toString()}>
          <Text style={{ textAlign: 'left' }}>{String(item[column.accessor])}</Text>
        </DataTable.Cell>
      ))}
      <DataTable.Cell style={{ flex: 1 }}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<IconButton icon="dots-vertical" onPress={openMenu} />}>
          {renderMenuItems(item)}
        </Menu>
      </DataTable.Cell>
    </DataTable.Row>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  noDataText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: 'gray',
  },
  tableContainer: {
    width: '100%',
  },
});

export default GenericTable;
