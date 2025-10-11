import * as React from 'react';
import { DataTable } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { Menu, IconButton } from 'react-native-paper';

interface Column<T> {
  header: string;
  accessor: keyof T;
}

interface ActionButton {
  title: string;
  onPress: () => void;
}

interface MenuItem {
  title: string;
  onPress: () => void;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  menuItems?: MenuItem[];
}

const GenericTable = <T extends object>(props: Props<T>) => {
  const { data, columns: initialColumns, menuItems } = props;
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([5, 10, 15]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, data.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          {initialColumns.map((column) => (
            <DataTable.Title key={column.accessor.toString()}>{column.header}</DataTable.Title>
          ))}
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>

        {data.slice(from, to).map((item, index) => (
          <DataTable.Row key={index.toString()}>
            {initialColumns.map((column) => (
              <DataTable.Cell key={column.accessor.toString()}>{String(item[column.accessor])}</DataTable.Cell>
            ))}
            <DataTable.Cell>
              <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={<IconButton icon="dots-vertical" onPress={openMenu} />}>
                {menuItems?.map((item, index) => (
                  <Menu.Item key={index} onPress={item.onPress} title={item.title} />
                ))}
              </Menu>
            </DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(data.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`{from + 1}-{to} of {data.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={'Rows per page'}
        />
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
});

export default GenericTable;